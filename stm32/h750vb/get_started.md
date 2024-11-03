### 下载地址
[keil社区版](https://www.keil.arm.com/mdk-community/)  
[DFP](https://www.keil.arm.com/packs/stm32h7xx_dfp-keil/overview/)  
[stm32h7软件包](https://www.st.com/en/embedded-software/stm32cubeh7.html#get-software)  
[CMSIS](https://github.com/ARM-software/CMSIS_6)  
![alt text](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=1080)
### 文件添加
```c
/* 文件夹结构 */
folder
    Libraries
        CMSIS                   
            Device              //软件包获取
            Include             //CMSIS获取
        STM32H7xx_HAL_Driver    //软件包获取
    Project
    User
        bsp
            inc
            src
            "bsp.c"
            "bsp.h"
            "stm32h7xx_hal_conf.h"
            "stm32h7xx_it.c"
            "stm32h7xx_it.h"
        segger
            "HardFaultHandler.S"
            "SEGGER_HardFaultHandler.c"
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
    "startup_stm32h750xx.s"    //堆和栈空间设置 中断向量表
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
### 文件
#### startup_stm32h750xx.s
堆栈设置
#### .map
keil中双击target查看/文件夹中搜索  
查看全局变量在RAM中的位置  
局部变量需在调试时查看  
Memory Map of the image  
    Load Region  程序在Flash中的实际存储  
    Execution Region  芯片上电后的运行状态  