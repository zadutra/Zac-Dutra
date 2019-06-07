//-----------------------------------------------------------------------------
// FindComponents.c
// Zachary Dutra
// zdutra
// 1581789
// pa5
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include "List.h"
#include "Graph.h"

#define MAX_LEN 250

int main(int argc, char * argv[]){
   FILE *in, *out;
   char line[MAX_LEN];
   int V1 = 0;
   int V2 = 0;
   int size = 0;
   int count = 0;
   char* token;
   Graph G;
   // check command line for correct number of arguments
   if( argc != 3 ){
      printf("Usage: %s <input file> <output file>\n", argv[0]);
      exit(1);
   }

   // open files for reading and writing 
   in = fopen(argv[1], "r");
   out = fopen(argv[2], "w");
   if( in==NULL ){
      printf("Unable to open file %s for reading\n", argv[1]);
      exit(1);
   }
   if( out==NULL ){
      printf("Unable to open file %s for writing\n", argv[2]);
      exit(1);
   }
   /* read each line of input file, then count and print tokens */
   for(int j = 0; fgets(line, MAX_LEN, in) != NULL; j++){
      if(j == 0){
         token = strtok(line, " \n");
         size = atoi(token);
         G = newGraph(size);
         continue;
      }
      token = strtok(line, " \n");
      V1 = atoi(token);
      token = strtok(NULL, " ");
      V2 = atoi(token);
      if(V1 == 0 && V2 == 0){
          break;
      }
      addArc(G,V1,V2);
   }
   //print out the graph
    fprintf(out, "Adjacency list representation of G:\n");
    printGraph(out, G);
    fprintf(out, "\n");

    //get transpose of G
    Graph Tpose = newGraph(size);
    Tpose = transpose(G);
    List GList = newList();
    for(int i=1; i <= size; i++){
        append(GList, i);
    }

    //run DFS on new graphs
    DFS(G, GList);
    DFS(Tpose, GList);

    //find strongly connected components
    moveFront(GList);
   for(int i = 0; i < size; i++){
      int x = get(GList);
      if(getParent(G, x) == 0){
         count++;
      }
      moveNext(GList);
   }
   fprintf(out, "G contains %d strongly connected components:\n", count);

   freeList(&GList);
   freeGraph(&G);
   freeGraph(&Tpose);
   /* close files */
   fclose(in);
   fclose(out);
}
