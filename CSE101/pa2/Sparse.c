#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"List.h"
#include"Matrix.h"

#define MAX_LEN 250

int main(int argc, char * argv[]){
    FILE *in, *out;
    char line[MAX_LEN];
    int mSize;
    int linenumber = 0;
    int A_NNZ;
    int B_NNZ;
    int row;
    int column;
    double data;
    char* token;
    Matrix A;
    Matrix B;
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
   for(int j = 0; fgets(line, MAX_LEN, in) != NULL; j++){
       if(j == 0){
           token = strtok(line, " \n");
           mSize = atoi(token);
           A = newMatrix(mSize);
           B = newMatrix(mSize);
           token = (NULL, " ");
           A_NNZ = atoi(token);
           token = (NULL, " ");
           B_NNZ = atoi(token);
           continue;
       }
       if(j < A_NNZ+1){
        token = strtok(line, " \n");
        row = atoi(token);
        token = strtok(NULL, " ");
        column = atoi(token);
        token = (NULL, " ");
        data = atoi(token);
        changeEntry(A, row, column, data);
       }
       else{
        token = strtok(line, " \n");
        row = atoi(token);
        token = strtok(NULL, " ");
        column = atoi(token);
        token = (NULL, " ");
        data = atoi(token);
        changeEntry(B, row, column, data);
       }
   }
    fprintf(out, "A has %d non-zero entries:\n", A_NNZ);
    printMatrix(out, A);
    fprintf(out, "B has %d non-zero entries:\n", B_NNZ);
    printMatrix(out, B);
    fprintf(out, "(1.5)*A =\n");
    Matrix C = scalarMult(1.5, A);
    printmatrix(C);
    fprintf(out,"A+B =\n");
    C = sum(A,B);
    printMatrix(out, C);
    fprintf(out,"A+A =\n");
    C = sum(A,A);
    printMatrix(out, C);
    fprintf(out,"B-A =\n");
    C = diff(B,A);
    printMatrix(out, C);
    fprintf(out,"A-A =\n");
    C = diff(A,A);
    printMatrix(out, C);
    fprintf(out,"Transpose(A) =\n");
    C = transpose(A);
    printMatrix(out, C);
    fprintf(out,"A*B =\n");
    C = product(A,B);
    printMatrix(out, C);
    fprintf(out,"B*B =\n");
    C = product(B,B);
    printMatrix(out, C);
}