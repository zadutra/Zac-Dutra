#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include <time.h>
#include <stdlib.h>

#define SIZE 1024

volatile __uint64_t A[SIZE][SIZE];
volatile __uint64_t B[SIZE][SIZE];
volatile __uint64_t C[SIZE][SIZE];
volatile __uint64_t D[SIZE][SIZE];
volatile __uint64_t E[SIZE][SIZE];
volatile __uint64_t Tile_result[SIZE][SIZE];

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
    for (int i0 = 0; i0 < SIZE; i0 += tile_size) {
        int imax = i0 + tile_size > SIZE ? SIZE : i0 + tile_size;
        for (int j0 = 0; j0 < M; j0 += tile_size) {
            int jmax = j0 + tile_size > SIZE ? SIZE : j0 + tile_size
            for (int k0 = 0; k0 < SIZE; k0 += tile_size) {
                int kmax = k0 + tile_size > SIZE ? SIZE : k0 + tile_size;

                for (int j1 = j0; j1 < jmax; ++j1) {
                    int sj = SIZE * j1;

                    for (int i1 = i0; i1 < imax; ++i1) {
                        int mi = SIZE * i1;
                        int ki = SIZE * i1;
                        int kij = ki + j1;

                        for (int k1 = k0; k1 < kmax; ++k1) {
                            C[kij] += A[mi + k1] * B[sj + k1];
                        }
                    }
                }
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
							Tile_Matmul(A,B,1);
								t = clock() - t;
									time_taken = ((double)t)/CLOCKS_PER_SEC; // in seconds
										
										printf("Matmul took %f seconds to execute \n", time_taken);
}
