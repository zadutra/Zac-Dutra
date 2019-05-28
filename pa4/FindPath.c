#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include "List.h"
#include "Graph.h"

#define MAX_LEN 250

int main(int argc, char * argv[]){
   FILE *in, *out;
   char line[MAX_LEN];
   // int compare, count = 0;
   int V1 = 0;
   int V2 = 0;
   int linecount = 0;
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
       linecount++;
      if(j==0){
          int size = (int)line[0];
          Graph G = newGraph(size);
          continue;
      }
      else if(line[0] == 0 && line[2] == 0){
          break;
      }
      V1 = (int)line[0];
      V2 = (int)line[2];
      addEdge(G,V1,V2);
      }
    fprintf(out, "%s\n", G);
   
   /* close files */
   fclose(in);
   fclose(out);
}