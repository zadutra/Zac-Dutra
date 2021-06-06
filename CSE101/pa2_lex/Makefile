#------------------------------------------------------------------------------
# Makefile for CMPS 101 Programming Assignment 2
#
#       make                   makes Lex
#       make ListClient        makes ListClient
#------------------------------------------------------------------------------

Lex : Lex.o List.o
	gcc -o Lex Lex.o List.o

Lex.o : Lex.c List.h
	gcc -c -std=c99 -Wall -g Lex.c

ListClient: ListClient.o List.o
	gcc -o ListClient ListClient.o List.o

ListClient.o : ListClient.c List.h
	gcc -c -std=c99 -Wall -g ListClient.c

ModelListTest: ModelListTest.o List.o
	gcc -o ModelListTest ModelListTest.o List.o

ModelListTest.o : ModelListTest.c List.h
	gcc -c -std=c99 -Wall -g ModelListTest.c

List.o : List.c List.h
	gcc -c -std=c99 -Wall -g List.c

check:
	 valgrind --leak-check=full --show leak-kinds=all Lex in1.txt out

clean :
	rm -f Lex ListClient Lex.o ListClient.o List.o
 
