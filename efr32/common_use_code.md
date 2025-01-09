### Useful Function

::: code-group

```c [delay_ms]
void delay_ms(int n)
{
    register int i, loops = SystemSYSCLKGet() / 5000;
    for ( ; n > 0; n--) {
        for(i = 0; i < loops; i++) {
            __NOP();
        }
    }
}
```

:::

### USART

::: code-group

```c [initClock]
CMU_ClockEnable(cmuClock_GPIO, true);
CMU_ClockEnable(cmuClock_USART0, true);
```

```c [initGPIO]
// Configure the USART TX pin to the board controller as an output
GPIO_PinModeSet(BSP_BCC_TXPORT, BSP_BCC_TXPIN, gpioModePushPull, 1);
// Configure the USART RX pin to the board controller as an input
GPIO_PinModeSet(BSP_BCC_RXPORT, BSP_BCC_RXPIN, gpioModeInput, 0);
```

```c [initUSART0]
void initUSART0(void)
{
  // Default asynchronous initializer (115.2 Kbps, 8N1, no flow control)
  USART_InitAsync_TypeDef init = USART_INITASYNC_DEFAULT;

  // Route USART0 TX and RX to the board controller TX and RX pins
  GPIO->USARTROUTE[0].TXROUTE = (BSP_BCC_TXPORT << _GPIO_USART_TXROUTE_PORT_SHIFT)
            | (BSP_BCC_TXPIN << _GPIO_USART_TXROUTE_PIN_SHIFT);
  GPIO->USARTROUTE[0].RXROUTE = (BSP_BCC_RXPORT << _GPIO_USART_RXROUTE_PORT_SHIFT)
            | (BSP_BCC_RXPIN << _GPIO_USART_RXROUTE_PIN_SHIFT);

  // Enable RX and TX signals now that they have been routed
  GPIO->USARTROUTE[0].ROUTEEN = GPIO_USART_ROUTEEN_RXPEN | GPIO_USART_ROUTEEN_TXPEN;

  // Configure and enable USART0
  USART_InitAsync(USART0, &init);
}
```

```c [retarget(printf)]
void _putchar(char character)
{
  USART_Tx(USART0, (uint8_t)character);
}
```

:::

### IADC

::: code-group

```c [define]
#define HFXO_FREQ                 38400000

// Set CLK_ADC to 10MHz
#define CLK_SRC_ADC_FREQ          40000000 // CLK_SRC_ADC
#define CLK_ADC_FREQ              10000000 // CLK_ADC - 10MHz max in normal mode

#define IADC_INPUT_0_PORT_PIN     iadcPosInputPortBPin0;
#define IADC_INPUT_0_BUS          BBUSALLOC
#define IADC_INPUT_0_BUSALLOC     GPIO_BBUSALLOC_BEVEN0_ADC0
```

```c [variables]
static volatile IADC_Result_t sample;
static volatile double singleResult; // Volts
```

```c [initHFXO]
void initHFXO(void)
{
  // Initialization structure for HFXO configuration
  CMU_HFXOInit_TypeDef hfxoInit = CMU_HFXOINIT_DEFAULT;

  // Check if device has HFXO configuration information in DEVINFO page
  if (DEVINFO->MODULEINFO & DEVINFO_MODULEINFO_HFXOCALVAL) {
    // Use the DEVINFO page's CTUNE values
    hfxoInit.ctuneXoAna = (DEVINFO->MODXOCAL & DEVINFO_MODXOCAL_HFXOCTUNEXOANA_DEFAULT)
        >> _DEVINFO_MODXOCAL_HFXOCTUNEXOANA_SHIFT;
    hfxoInit.ctuneXiAna = (DEVINFO->MODXOCAL & DEVINFO_MODXOCAL_HFXOCTUNEXIANA_DEFAULT)
        >> _DEVINFO_MODXOCAL_HFXOCTUNEXIANA_SHIFT;
  }

  // Configure HFXO settings
  CMU_HFXOInit(&hfxoInit);

  // Set system HFXO frequency
  SystemHFXOClockSet(HFXO_FREQ);

  // Enable HFXO oscillator, and wait for it to be stable
  CMU_OscillatorEnable(cmuOsc_HFXO, true, true);

  // Select HFXO as the EM01GRPA clock
  CMU_ClockSelectSet(cmuClock_EM01GRPACLK, cmuSelect_HFXO);
}
```

```c [initCmu]
CMU_ClockEnable(cmuClock_GPIO, true);
```

```c [initIADC]
void initIADC (void)
{
  // Declare init structs
  IADC_Init_t init = IADC_INIT_DEFAULT;
  IADC_AllConfigs_t initAllConfigs = IADC_ALLCONFIGS_DEFAULT;
  IADC_InitSingle_t initSingle = IADC_INITSINGLE_DEFAULT;
  IADC_SingleInput_t initSingleInput = IADC_SINGLEINPUT_DEFAULT;

  // Enable IADC0 clock branch
  CMU_ClockEnable(cmuClock_IADC0, true);

  // Reset IADC to reset configuration in case it has been modified by
  // other code
  IADC_reset(IADC0);

  // Select clock for IADC
  CMU_ClockSelectSet(cmuClock_IADCCLK, cmuSelect_EM01GRPACLK);

  // Modify init structs and initialize
  init.warmup = iadcWarmupKeepWarm;

  // Set the HFSCLK prescale value here
  init.srcClkPrescale = IADC_calcSrcClkPrescale(IADC0, CLK_SRC_ADC_FREQ, 0);

  // Configuration 0 is used by both scan and single conversions by default
  // Use internal bandgap (supply voltage in mV) as reference
  initAllConfigs.configs[0].reference = iadcCfgReferenceInt1V2;
  initAllConfigs.configs[0].vRef = 1210;
  initAllConfigs.configs[0].analogGain = iadcCfgAnalogGain0P5x;

  // Divides CLK_SRC_ADC to set the CLK_ADC frequency
  initAllConfigs.configs[0].adcClkPrescale = IADC_calcAdcClkPrescale(IADC0,
                                             CLK_ADC_FREQ,
                                             0,
                                             iadcCfgModeNormal,
                                             init.srcClkPrescale);

  // Oversampling
  initAllConfigs.configs[0].osrHighSpeed = iadcCfgOsrHighSpeed32x;
  initAllConfigs.configs[0].digAvg = iadcDigitalAverage16;
  initSingle.alignment = iadcAlignRight20;

  // Assign pins to positive and negative inputs in differential mode
  initSingleInput.posInput = IADC_INPUT_0_PORT_PIN;
  initSingleInput.negInput = iadcNegInputGnd;

  // Allocate the analog bus for ADC0 inputs
  GPIO->IADC_INPUT_0_BUS |= IADC_INPUT_0_BUSALLOC;

  // Initialize IADC
  IADC_init(IADC0, &init, &initAllConfigs);

  // Initialize Single
  IADC_initSingle(IADC0, &initSingle, &initSingleInput);

  // Clear any previous interrupt flags
  IADC_clearInt(IADC0, _IADC_IF_MASK);

  // Enable single done interrupts
  IADC_enableInt(IADC0, IADC_IEN_SINGLEDONE);

  // Enable ADC interrupts
  NVIC_ClearPendingIRQ(IADC_IRQn);
  NVIC_EnableIRQ(IADC_IRQn);
}
```

```c [IRQ]
void IADC_IRQHandler(void)
{
  sample = IADC_readSingleResult(IADC0);

  singleResult = sample.data * 2.42 / 0xFFFFF;

  IADC_clearInt(IADC0, IADC_IF_SINGLEDONE);
}
```

:::

### LETIMER

::: code-group

```c [initCmu]
CMU_ClockEnable(cmuClock_LETIMER0, true);
```

```c [initClock]
  CMU_LFXOInit_TypeDef lfxoInit = CMU_LFXOINIT_DEFAULT;

  // Select LFXO for the LETIMER
  CMU_LFXOInit(&lfxoInit);
  CMU_ClockSelectSet(cmuClock_EM23GRPACLK, cmuSelect_LFXO);
```

```c [initLetimer]
void initLetimer(void)
{
  LETIMER_Init_TypeDef letimerInit = LETIMER_INIT_DEFAULT;

  // Calculate the top value (frequency) based on clock source
  uint32_t topValue = CMU_ClockFreqGet(cmuClock_LETIMER0) / OUT_FREQ;

  // Reload top on underflow, pulse output, and run in free mode
  letimerInit.comp0Top = true;
  letimerInit.topValue = topValue;
  letimerInit.repMode = letimerRepeatFree;

  // Initialize and enable LETIMER
  LETIMER_Init(LETIMER0, &letimerInit);

  // Clear any previous interrupt flags
  LETIMER_IntClear(LETIMER0, _LETIMER_IF_MASK);

  // Enable underflow interrupts
  LETIMER_IntEnable(LETIMER0, LETIMER_IEN_UF);

  // Enable LETIMER interrupts
  NVIC_ClearPendingIRQ(LETIMER0_IRQn);
  NVIC_EnableIRQ(LETIMER0_IRQn);
}
```

```c [IRQ]
void LETIMER0_IRQHandler(void)
{
  uint32_t flags = LETIMER_IntGet(LETIMER0);
  LETIMER_IntClear(LETIMER0, flags);
}
```

:::