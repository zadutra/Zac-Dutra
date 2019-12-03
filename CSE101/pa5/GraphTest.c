//-----------------------------------------------------------------------------
// GraphTest.c
// Zachary Dutra
// zdutra
// 1581789
// pa5
//-----------------------------------------------------------------------------
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <signal.h>
#include <setjmp.h>

#include "Graph.h"
#include "List.h"
#define NIL -1

int main(int argc, char * argv[]){
int temp = 100;
Graph A = newGraph(temp);
List L = newList();
 for (uint8_t i = 1; i <= 100; i++){
          if (getDiscover(A, i) != UNDEF) printf("1");
 }
        addEdge(A, 64, 4);
        addEdge(A, 64, 3);
        addEdge(A, 42, 2);
        addEdge(A, 2, 64);
        addEdge(A, 4, 2);
        addEdge(A, 3, 42);
        for (uint8_t i = 1; i <= 100; i++) {
          prepend(L, i);
        }
        DFS(A, L);
        if (getDiscover(A, 100) != 1)  printf("2");
        if (getDiscover(A, 64) != 73)  printf("3");
        if (getDiscover(A, 4) != 75)  printf("4");
        DFS(A, L);
        if (getDiscover(A, 4) != 121)  printf("5");
        if (getDiscover(A, 63) != 117)  printf("6");
        DFS(A, L);
        if (getDiscover(A, 65) != 71) printf("7");
        if (getDiscover(A, 1) != 199) printf("8");
        return 0;
}
