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
int temp = 10;
Graph G = newGraph(temp);
List L = newList();
//List C = newList();
   addArc(G, 1,2);
   addArc(G, 1,5);
   addArc(G, 2,5);
   addArc(G, 2,6);
   addArc(G, 3,2);
   addArc(G, 3,4);
   addArc(G, 3,6);
   addArc(G, 3,7);
   addArc(G, 3,8);
   addArc(G, 6,5);
   addArc(G, 6,7);
   addArc(G, 8,4);
   addArc(G, 8,7);
   addArc(G, 6, 4);
   addArc(G, 5, 2);
   addArc(G, 4, 1);
   for(int i = 1; i <= 10; i++){
     append(L, i);
   }
   DFS(G, L);
   printf("Before Transpose List\n");
   printList(stdout, L);
   Graph TPose = transpose(G);
   printf("After Transpose List\n");
   printList(stdout, L);;

}
