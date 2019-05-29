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
//List L = newList();
//List C = newList();
 for (uint8_t i = 1; i <= 100; i++)
          if (getDist(A, i) != INF) return 1;
        addArc(A, 64, 4);
        addArc(A, 64, 3);
        addArc(A, 42, 2);
        addArc(A, 2, 64);
        addArc(A, 4, 2);
        addArc(A, 3, 42);
        BFS(A, 64);
        if (getDist(A, 64) != 0) return 2;
        if (getDist(A, 2) != 2) return 3;
        BFS(A, 4);
        if (getDist(A, 42) != 4) return 4;
        if (getDist(A, 43) != INF) return 5;
        BFS(A, 99);
        if (getDist(A, 64) != INF){
          printf("6");
        };
}
