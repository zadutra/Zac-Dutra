/*
Zachary Dutra
zdutra
1581789
pa2
*/ 
#include<stdio.h>
#include<stdlib.h>
#include"List.h"
#include"Matrix.h"
int main(int argc, char* argv[]){
      Matrix A = newMatrix(10);
        changeEntry(A, 2, 1, 2);
        changeEntry(A, 3, 1, 5);
        changeEntry(A, 1, 2, 2);
        changeEntry(A, 1, 3, 5);
        changeEntry(A, 1, 1, 4);
        changeEntry(A, 2, 2, 2);
        changeEntry(A, 2, 5, 0);
        changeEntry(A, 2, 3, 0);
        changeEntry(A, 3, 3, 5);
        if (getNNZ(A) != 7) return 1;
        changeEntry(A, 1, 3, 0);
        changeEntry(A, 3, 1, 0);
        changeEntry(A, 3, 3, 0);
        if (getNNZ(A) != 4) return 2;
        changeEntry(A, 7, 6, 42);
        changeEntry(A, 10, 1, 24);
        if (getNNZ(A) != 6) return 3;
        changeEntry(A, 7, 6, 0);
        if (getNNZ(A) != 5) return 4;
        makeZero(A);
        changeEntry(A, 5, 5, 5);
        if (getNNZ(A) != 1) return 5;
}