//-----------------------------------------------------------------------------
// Graph.h
// Zachary Dutra
// zdutra
// 1581789
// pa5
//-----------------------------------------------------------------------------
#ifndef _Graph_H_INCLUDE
#define _Graph_H_INCLUDE
#include "List.h"
#define NIL -1
#define INF -2

typedef struct GraphObj* Graph;
/*** Constructors-Destructors ***/
Graph newGraph(int n);
void freeGraph(Graph* pG);
/*** Access functions ***/
int getOrder(Graph G);
int getSize(Graph G);
int getParent(Graph G, int u);
int getDiscover(Graph G, int u);
int getFinish(Graph G, int u);
/*** Manipulation procedures ***/
void makeNull(Graph G);
void addEdge(Graph G, int u, int v);
void addArc(Graph G, int u, int v);
void DFS(Graph G, List s);
void visit(Graph G, List S, int x);
/*** Other operations ***/
Graph transpose(Graph G);
Graph copyGraph(Graph G);
void printGraph(FILE* out, Graph G);

#endif
