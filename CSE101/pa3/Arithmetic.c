#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include "Biginteger.h"

#define MAX_LEN 250

int main(int argc, char* argv[]){
    FILE *in, *out;
    char line[MAX_LEN];
    int aSize;
    int bSize;
    char* token;
    BigInteger A = newBigInteger();
    BigInteger B = newBigInteger();
    BigInteger output = newBigInteger();

    // check command line for correct number of arguments
   if( argc != 3 ){
      printf("Usage: %s <input file> <output file>\n", argv[0]);
      exit(1);
   }
 
   // open files for reading and writing 
   in = fopen(argv[1], "r");
   out = fopen(argv[2], "w");

   if( in == NULL ){
      printf("Unable to open file %s for reading\n", argv[1]);
      exit(1);
   }

   if( out == NULL ){
      printf("Unable to open file %s for writing\n", argv[2]);
      exit(1);
   }
   for(int j = 0; fgets(line, MAX_LEN, in) != NULL; j++){
       fprintf(stdout, "%s\n", line);
       token = strtok(line, " \n");
       if(j == 0){
           aSize = atoi(token);
           continue;
       }
       if(j == 2){
            bSize = atoi(token);
            continue;
       }
       if(j == 1){
           BigInteger A = stringToBigInteger(token);
       }
       if(j == 4){
           BigInteger B = stringToBigInteger(token);
       }
   }
   

}