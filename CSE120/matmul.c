#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include <time.h>
#include <stdlib.h>

#define SIZE 4

volatile __uint64_t A[SIZE][SIZE];
volatile __uint64_t B[SIZE][SIZE];
volatile __uint64_t C[SIZE][SIZE];
volatile __uint64_t D[SIZE][SIZE];
volatile __uint64_t E[SIZE][SIZE];
volatile __uint64_t tile_result[SIZE][SIZE];

void transpose(volatile __uint64_t D[][SIZE], volatile __uint64_t A[][SIZE])
{
		int r, c;

			for (c = 0; c < SIZE; c++) {
						for (r = 0; r < SIZE; r++) {
										D[r][c] = A[c][r];
								}
							}
}

void init(volatile __uint64_t A[][SIZE], volatile __uint64_t B[][SIZE])
{
		int r, c;

			for (c = 0; c < SIZE; c++) {
						for (r = 0; r < SIZE; r++) {
										A[r][c] = rand();
										B[r][c] = rand();
								}
							}
}

void Trans_init(volatile __uint64_t A[][SIZE], volatile __uint64_t B[][SIZE])
{
		int r, c;

			for (c = 0; c < SIZE; c++) {
						for (r = 0; r < SIZE; r++) {
										A[r][c] = rand();
										B[r][c] = rand();
								}
							}
			transpose(D,A);
			transpose(E,B);
}
void matmul(volatile __uint64_t A[][SIZE], volatile __uint64_t B[][SIZE])
{
	int rowA, colB, idx;

	for (rowA = 0; rowA < SIZE; rowA++) {
		for (colB = 0; colB < SIZE; colB++) {
			for (idx = 0; idx < SIZE; idx++) {
				D[rowA][colB] += A[rowA][idx] * B[idx][colB];
			}
		}
	}
}
void Tile_matmul(volatile __uint64_t A[][SIZE], volatile __uint64_t B[][SIZE], int tile_size) {
    for(int i = 0; i < SIZE; i+=tile_size){
		for(int j = 0; j < SIZE; j += tile_size){
				for(int k = 0; k < tile_size; k++){
					if(k == 0){
						tile_result[i][j] = A[i][j] * B[i][j];
						continue;
					}
					printf("gets out of if condition \n");
					tile_result[i + k][j] = A[i + k][j] * B[i + k][j];
					tile_result[i][j + k] = A[i][j + k] * B[i][j + k];
					tile_result[i + k][j + k] = A[i + k][j + k] * B[i + k][j + k];
				}
			}
		}
	}
int verify(volatile __uint64_t C[][SIZE], volatile __uint64_t D[][SIZE])
{
		int r, c;

			for (c = 0; c < SIZE; c++) {
						for (r = 0; r < SIZE; r++) {
										if (C[r][c] != D [r][c]) {
											printf("error\n");
											return -1;
										}
													
								}
							}
				return 0;
}

void Trans_matmul(volatile __uint64_t A[][SIZE], volatile __uint64_t B[][SIZE])
{
		int rowA, rowB, idx;

			for (rowA = 0; rowA < SIZE; rowA++) {
						for (rowB = 0; rowB < SIZE; rowB++) {
										for (idx = 0; idx < SIZE; idx++) {
												C[rowA][rowB] += A[rowA][idx] * B[rowB][idx];
													}
												}
							}
}

int main(int argc, char **argv)
{
		clock_t t;
			double time_taken;
				init(A, B);
					memset((__uint64_t**)C, 0, sizeof(__uint64_t) * SIZE * SIZE);
						t = clock();
							matmul(A,B);
							for(int i = 0; i < SIZE; i++){
								for(int j = 0; j < SIZE; j++){
									printf("%d ", D[i][j]);
								}
								printf("\n");
							}
							printf("\n");
							Tile_matmul(A,B,1);
							for(int i = 0; i < SIZE; i++){
								for(int j = 0; j < SIZE; j++){
									printf("%d ", tile_result[i][j]);
								}
								printf("\n");
							}
								t = clock() - t;
									time_taken = ((double)t)/CLOCKS_PER_SEC; // in seconds
										
										printf("Matmul took %f seconds to execute \n", time_taken);
}
