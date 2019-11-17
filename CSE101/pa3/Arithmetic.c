//-----------------------------------------------------------------------------
// Arithmetic.c
// Zachary Dutra
// zdutra
// 1581789
// pa3
//-----------------------------------------------------------------------------


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
    BigInteger C = newBigInteger();
    BigInteger D = newBigInteger();
    BigInteger E = newBigInteger();

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

   printBingInteger(out, A);
   fprintf(out, "\n");
   printBigInteger(out, B);
   fprintf(out, "\n");
   C = sum(A, B);
   printBigInteger(out, C);
   fprintf(out,"\n");
   C = diff(A,B);
   printBigInteger(out, C);
   fprintf(out, "\n");
   C = diff(A,A);
   printBigInteger(out, C);
   fprintf(out, "\n");
   C = product(A, 3);
   D = product(B,2);
   E = diff(C,D);
   printBigInteger(out, E);
   fprintf(out, "\n");
   E = product(A,B);
   printBigInteger(out, E);
   fprintf(out, "\n");
   C = product(A,A);
   printBigInteger(out, C);
   fprintf(out, "\n");
   D = product(B,B);
   printBigInteger(out, D);
   fprintf(out, "\n");
   C = product(C,C);
   C = product(C, 9);
   D = product(D,D);
   D = product(D,B);
   D = product(D,16);
   E = sum(C,D);
   printBigInteger(out, E);
   fprintf(out, "\n");



}
