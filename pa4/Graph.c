#include<stdio.h>
#include<stdlib.h>
#include "List.h"
#include "Graph.h"
#define NIL -1
#define INF -2
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
    int source;
    int order;
    List* arrList;
    int* parent;
    int* dist;
    char* color;
} GraphObj;

typedef GraphObj* Graph;
/*** Constructors-Destructors ***/
Graph newGraph(int n){
   Graph g = malloc(sizeof(GraphObj));
   g->order = n;
   g->size = 0;
   g->source = -10;
   g->arrList = malloc(sizeof(ListObj)*(n+1));
   g->parent = malloc(sizeof(int)*(n+1));
   g->dist = malloc(sizeof(int)*(n+1));
   g->color = malloc(sizeof(char)*(n+1));
   for(int i = 1; i <= n+1; i++){
      g->arrList[i] = newList();
   }
   return g;
};
void freeGraph(Graph* pG){
   free((*pG)->arrList);
   free((*pG)->parent);
   free((*pG)->color);
   free((*pG)->dist);
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
int getSource(Graph G){
   return (int)G->source;
};
int getParent(Graph G, int u){
   return (int)(G->parent[u]);
};
int getDist(Graph G, int u){
   return (int)(G->dist[u]);
};
void getPath(List L, Graph G, int u){
   if(getSource(G) == -10){
      printf("Calling getpath() on undefined source\n");
      exit(1);
   }
   if(u == getSource(G)){
      append(L, u);
      return;
   }
   else if(getParent(G, u) == NIL){
      printf("value not in graph\n");
      exit(1);
   }
   else{
      int temp = getParent(G, u);
      getPath(L, G, temp);
      append(L, u);
   }
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
      ++G->size;
   }
   //if new edge is bigger than current largest, append
   else if(back(G->arrList[u]) < v){
      append(G->arrList[u], v);
      moveFront(G->arrList[u]);
      ++G->size;
   }
   //go through list and insertbefore
   else{
      for(int i = 0; i < length(G->arrList[u]); i++){
         if(v < get(G->arrList[u])){
            insertBefore(G->arrList[u], v);
            moveFront(G->arrList[u]);
            ++G->size;
            break;
         }
         moveNext(G->arrList[u]);
      }
   }
};
void BFS(Graph G, int s){
   List Queue = malloc(sizeof(int)*(G->order+1));
   Queue = newList();
   G->source = s;
   for(int x = 1; x <= G->order; x++){
      G->color[x] = 'w';
      G->dist[x] = INF;
      G->parent[x] = NIL;
   }
   G->color[s] = 'g';
   G->dist[s] = 0;
   append(Queue, s);
   moveFront(Queue);
   while(!isEmpty(Queue)){
      int x = get(Queue);
      moveFront(G->arrList[x]);
      deleteFront(Queue);
      for(int i = 1; i <= length(G->arrList[x]); i++){
         int y = get(G->arrList[x]);
         if(G->color[y] == 'w'){
            G->color[y] = 'g';
            G->dist[y] = G->dist[x] + 1;
            G->parent[y] = x;
            append(Queue,y);
         }
         G->color[x] = 'b';
         moveNext(G->arrList[x]);
      }
      moveFront(Queue);
   }
   free(Queue);
};
/*** Other operations ***/
void printGraph(FILE* out, Graph G){
   for(int i = 1; i <= G->order; i++){
      fprintf(out, "%d: ", i);
      printList(out, G->arrList[i]);
   }
};
