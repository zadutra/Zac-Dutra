//-----------------------------------------------------------------------------
// FindPath.c
// Zachary Dutra
// zdutra
// 1581789
// pa4
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
      addEdge(G,V1,V2);
   }
   //print out the graph
    printGraph(out, G);
    fprintf(out, "\n");
   
   //now go through file and get pairs to search paths for
   for(int j = 0; fgets(line, MAX_LEN, in) != NULL; j++){
      List GList = newList();
      token = strtok(line, " \n");
      V1 = atoi(token);
      token = strtok(NULL, " ");
      V2 = atoi(token);
      if(V1 == 0 && V2 == 0){
          break;
      }
      BFS(G, V1);
      getPath(GList, G, V2);
      if(getDist(G,V2) == INF){
         fprintf(out, "The distance from %d to %d is infinity\n", V1, V2);
         fprintf(out, "No %d-%d path exists\n", V1, V2);
         continue;
      }
      fprintf(out, "The distance from %d to %d is %d\n", V1, V2, getDist(G,V2));
      fprintf(out, "A shortest %d-%d path is: ", V1, V2);
      printList(out, GList);
      fprintf(out, "\n");
   }
   freeGraph(&(G));
   /* close files */
   fclose(in);
   fclose(out);
}
