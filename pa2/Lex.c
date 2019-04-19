//-----------------------------------------------------------------------------
// Lex.c
// Zachary Dutra
// zdutra
// 1581789
// pa2
//-----------------------------------------------------------------------------

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include "List.h"

#define MAX_LEN 250

int main(int argc, char * argv[]){

   int n, linecount=0;
   FILE *in, *out;
   char line[MAX_LEN];
   char in_list[MAX_LEN];
   char* token;
   // int compare, count = 0;
   // int j = 0;

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
   while( fgets(line, MAX_LEN, in) != NULL)  {
      linecount++;
      n = 0;
      token = strtok(line, " \n");
      
      while( token != NULL ){
         strcat((in_list+n), token);
         strcat((in_list+n), "\n");
         n++;
         token = strtok(NULL, " \n");
      }
   }
   fprintf(out,"%s", in_list+1);
   List Lex_list = newList();
   prepend(Lex_list, 0);
   moveFront(Lex_list);
  /* while(count < linecount){
     // compare = strcmp(in_list[j], in_list[get(Lex_list)]);
      if(compare <= 0){
         insertBefore(Lex_list, j);
         j++;
         count++;
         moveFront(Lex_list);
         continue;
      }
      else if(compare > 0 && get(Lex_list)!= back(Lex_list)){
         moveNext(Lex_list);
         continue;
      }
      else{
         append(Lex_list, j);
         j++;
         count++;
         moveFront(Lex_list);
      }
   }
*/
   /* close files */
   fclose(in);
   fclose(out);

   return(0);
}