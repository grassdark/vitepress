### gpio
```c
__HAL_RCC_GPIOA_CLK_ENABLE();

GPIO_InitTypeDef gpio_init_struct;
gpio_init_struct.Mode = GPIO_MODE_OUTPUT_PP;
gpio_init_struct.Pin = LED3_GPIO_PIN;
gpio_init_struct.Pull = GPIO_NOPULL;
gpio_init_struct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;

HAL_GPIO_Init(GPIOA, &gpio_init_struct);
```
用BSRR去改变管脚状态的时候，没有被中断打断的风险。

### NVIC
IRQ  中断请求（Interrupt Request）  
ISR  中断服务程序（Interrupt Service Routine）  