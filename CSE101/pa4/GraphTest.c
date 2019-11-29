//-----------------------------------------------------------------------------
// GraphTest.c
// Zachary Dutra
// zdutra
// 1581789
// pa4
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
List C = newList();
  //UG getpath test 4
  addEdge(A, 64, 4);
        addEdge(A, 64, 3);
        addEdge(A, 42, 2);
        addEdge(A, 2, 64);
        addEdge(A, 4, 2);
        addEdge(A, 3, 42);
        BFS(A, 3);
        getPath(L, A, 64);
        append(C, 3);
        append(C, 64);
        if (!equals(L, C)) return 1;
        moveFront(L);
        BFS(A, 2);
        getPath(L, A, 2);
        append(C, 2);
        if (!equals(L, C)) return 2;
        getPath(L, A, 99);
        if (equals(L, C)) return 3;
        clear(L);
        clear(C);
        append(C, NIL);
        BFS(A, 99);
        getPath(L, A, 2);
        if (!equals(C, L)){
          printf("4");
        };
        return 0;
}
