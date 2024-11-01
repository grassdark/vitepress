```c
  #define __HAL_LOCK(__HANDLE__)                                           \
                                do{                                        \
                                    if((__HANDLE__)->Lock == HAL_LOCKED)   \
                                    {                                      \
                                       return HAL_BUSY;                    \
                                    }                                      \
                                    else                                   \
                                    {                                      \
                                       (__HANDLE__)->Lock = HAL_LOCKED;    \
                                    }                                      \
                                  }while (0)
```
在Linux和其它代码库里的，很多宏实现都使用do/while(0)来包裹他们的逻辑，这样不管在调用代码中怎么使用分号和大括号，而该宏总能确保其行为是一致的。