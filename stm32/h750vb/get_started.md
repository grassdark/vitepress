### 下载地址
[keil社区版](https://www.keil.arm.com/mdk-community/)  
[stm32h7软件包](https://www.st.com/en/embedded-software/stm32cubeh7.html#get-software)  
![alt text](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=1080)
### 文件添加
```c
/* 文件夹结构 */
folder
    Doc
    Libraries
        CMSIS                   
            Device              //从软件包获取
            Include
        STM32H7xx_HAL_Driver    //从软件包获取
    Project

    User
        bsp
            inc
            src
        segger
        "main.c"
```
keil添加Groups
```c
User
    "main.c"
BSP
    "bsp.c"
    "bsp.h"
    "stm32h7xx_it.c"
MDK-ARM
    "startup_stm32.c"    //堆和栈空间设置 中断向量表
HAL_Driver
    "stm32h7xx_hal_conf.h"
    "stm32h7xx_hal.c"
    "stm32h7xx_hal_cortex.c"
    "stm32h7xx_hal_dma.c"
    "stm32h7xx_hal_dma_ex.c"
    "stm32h7xx_hal_gpio.c"
    "stm32h7xx_hal_mdma.c"
    "stm32h7xx_hal_tim.c"
    "stm32h7xx_hal_tim_ex.c"
    "stm32h7xx_hal_uart.c"
    "stm32h7xx_hal_uart_ex.c"
    "stm32h7xx_ll_fmc.c"
    "stm32h7xx_hal_sram.c"
    "stm32h7xx_hal_rcc.c"
    "stm32h7xx_hal_rcc_ex.c"
CMSIS
    "system_stm32h7xx.c"    //复位RCC相关寄存器 中断向量表位置设置
SEGGER/HardFault
    "HardFaultHandler.S"
    "SEGGER_HardFaultHandler.c"
Doc
```
### Options for Target
#### Device
#### Target
arm compiler AC6  
:ballot_box_with_check: Use MicroLIB

stm32h750vb的Flash首地址为0x08000000，大小128KB
| default | on-chip | Start | Size |
|:-:|:-:|:-:|:-:|
| :ballot_box_with_check: | IROM1: | 0x08000000 | 0x20000 |

默认RAM选择DTCM，另一个为AXI SRAM。
| default | on-chip | Start | Size |
|:-:|:-:|:-:|:-:|
| :ballot_box_with_check: | IRAM1: | 0x20000000 | 0x20000 |
| | IRAM2: | 0x24000000 | 0x80000 |
#### Output
#### Listing
#### User
#### C/C++(AC6)
Define: USE_HAL_DRIVER, STM32H750xx  
0级别优化  
:ballot_box_with_check:C99 Mode  
Include Paths
- ..\Libraries\CMSIS\Include
- ..\Libraries\CMSIS\Device\ST\STM32H7xx\Include
- ..\Libraries\STM32H7xx_HAL_Driver\Inc
- ..\User\bsp\inc
- ..\User\bsp
- ..\User

#### Asm
#### Linker
#### Debug
#### Utilities