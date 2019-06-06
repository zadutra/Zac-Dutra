//-----------------------------------------------------------------------------
// Graph.c
// Zachary Dutra
// zdutra
// 1581789
// pa5
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include "List.h"
#include "Graph.h"
#define NIL -1
#define UNDEF -2
typedef struct NodeObj{
   int data;
   struct NodeObj* next;
} NodeObj;

// private Node type
typedef NodeObj* Node;

// private QueueObj type
typedef struct ListObj{
   Node front;
   Node back;
   Node cursor;
   int length;
   int index;
} ListObj;

typedef struct GraphObj{
    int size;
    int order;
    int time;
    List* arrList;
    int* parent;
    int* discover;
    int* finish;
    char* color;
} GraphObj;

typedef GraphObj* Graph;
/*** Constructors-Destructors ***/
Graph newGraph(int n){
   Graph g = malloc(sizeof(GraphObj));
   g->order = n;
   g->size = 0;
   g->time = 0;
   g->arrList = malloc(sizeof(ListObj)*(n+1));
   g->parent = malloc(sizeof(int)*(n+1));
   g->discover = malloc(sizeof(int)*(n+1));
   g->finish = malloc(sizeof(int)*(n+1));
   g->color = malloc(sizeof(char)*(n+1));
   for(int i = 0; i <= n+1; i++){
      g->arrList[i] = newList();
      g->parent[i] = NIL;
      g->discover[i] = UNDEF;
      g->finish[i] = UNDEF;
   }
   return g;
};
void freeGraph(Graph* pG){
   free((*pG)->arrList);
   free((*pG)->parent);
   free((*pG)->finish);
   free((*pG)->discover);
   free(*pG);
   return;
};
/*** Access functions ***/
int getOrder(Graph G){
   return (int)G->order;
};
int getSize(Graph G){
   return (int)G->size;
};
int getParent(Graph G, int u){
   return (int)(G->parent[u]);
};
int getDiscover(Graph G, int u){
   return (int)(G->discover[u]);
};
int getFinish(Graph G, int u){
   return (int)(G->finish[u]);
};
/*** Manipulation procedures ***/
void makeNull(Graph G){
   for(int i = 1; i <= G->order; i++){
      clear(G->arrList[i]);
   }
   return;
};
void addEdge(Graph G, int u, int v){
   if(u > G->order || v > G->order || u < 1 || v < 1){
      printf("out of graph bounds");
      return;
   }
   addArc(G, u, v);
   addArc(G, v, u);
   G->size--;
};
//adds a directional edge to u, not to v
void addArc(Graph G, int u, int v){
   if(u > G->order || v > G->order || u < 1 || v < 1){
      printf("out of graph bounds");
      return;
   }
   //adding v to u
   //if list empty prepend
   if(length(G->arrList[u]) == 0){
      prepend(G->arrList[u], v);
      moveFront(G->arrList[u]);
      G->size++;
   }
   //if new edge is bigger than current largest, append
   else if(back(G->arrList[u]) < v){
      append(G->arrList[u], v);
      moveFront(G->arrList[u]);
      G->size++;
   }
   //go through list and insertbefore
   else{
      for(int i = 0; i < length(G->arrList[u]); i++){
         if(v < get(G->arrList[u])){
            insertBefore(G->arrList[u], v);
            moveFront(G->arrList[u]);
            G->size++;
            break;
         }
         moveNext(G->arrList[u]);
      }
   }
};

Graph transpose(Graph G){
   Graph Tpose = newGraph(G->order);
   for(int i = 1; i <= G->order; i++){
      moveFront(G->arrList[i]);
      for(int j = 0; j < length(G->arrList[i]); j++){
         int x = get(G->arrList[i]);
         addArc(Tpose, x, i);
         moveNext(G->arrList[i]);
      }
      moveFront(G->arrList[i]);
   }
   return Tpose;
};
void DFS(Graph G, List S){
   List temp = newList();
   if(length(S) != getOrder(G)){
      printf("DFS initial condition");
   }
   for(int x = 1; x <= G->order; x++){
      G->color[x] = 'w';
      G->discover[x] = UNDEF;
      G->finish[x] = UNDEF;
      G->parent[x] = 0;
   }
   moveFront(S);
   for(int i = 0; i < G->order; i++){
      int s = get(S);
      if(G->color[s] == 'w'){
         visit(G, temp, s);
      }
      moveNext(S);
   }
   clear(S);
   moveFront(temp);
   for(int i = 0; i < G->order; i++){
      append(S, get(temp));
      moveNext(temp);
   }
   clear(temp);
   free(temp);
};
void visit(Graph G, List S, int x){
   ++G->time;
   G->discover[x] = G->time;
   moveFront(G->arrList[x]);
   for(int i = 0; i < length(G->arrList[x]); i++){
      int y = get(G->arrList[x]);
      if(G->color[y] == 'w'){
         G->parent[y] = x;
         visit(G, S, y);
      }
      moveNext(G->arrList[x]);
   }
   G->color[x] = 'b';
   G->finish[x] = ++G->time;
   prepend(S, x);
};
/*** Other operations ***/
void printGraph(FILE* out, Graph G){
   for(int i = 1; i <= G->order; i++){
      fprintf(out, "%d: ", i);
      printList(out, G->arrList[i]);
   }
};

Graph copyGraph(Graph G){
   Graph C = newGraph(G->order);
   C->size = G->size;
   for(int i = 1; i <= G->order ; i++){
      C->arrList[i] = G->arrList[i];
      C->parent[i] = G->parent[i];
      C->discover[i] = G->discover[i];
      C->finish[i] = G->finish[i];
      C->color[i] = G->color[i];
   } 
   return C;
};
