__builtin_bswap16/32/64是GCC和Clang编译器提供的内置函数，用于交换一个整数的字节顺序。其中，__builtin_bswap16用于交换一个16位整数的字节顺序
__builtin_bswap16()函数调用优先级高
```c
*data = (__builtin_bswap16(recv[0]) << 16) + (__builtin_bswap16 (recv[1]));
```