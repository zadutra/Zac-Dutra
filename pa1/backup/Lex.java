/*
Zachary Dutra
zdutra
1581789
pa1
*/

import java.util.*;
import java.io.*;

class Lex{
    public static void main(String[]args)throws IOException{
        PrintWriter out;
        Scanner in;
        String line;
        String[] token;
        int n = 0;
        int comp = 0;
        int lineNumber = 0;
        int j = 1;
        int count = 1;
        int stringcount = 0;
        if(args.length < 2){
            System.err.println("Usage: FileIO infile outfile");
            System.exit(1);
        }
        FileReader fr = new FileReader(args[0]);
        LineNumberReader lnr = new LineNumberReader(fr);
        in = new Scanner(new File(args[0]));
        FileWriter output = new FileWriter(new File(args[1]));
        out = new PrintWriter(output);
        while(lnr.readLine()!=null){
            lineNumber++;
        }
        String[] a_list = new String[lineNumber];
        while(in.hasNextLine()){
            line = in.nextLine();
            a_list[stringcount] = line;
            stringcount++;
        }
            List LexList = new List();
            LexList.prepend(0);
            LexList.moveFront();
            while(count < lineNumber){
                comp = a_list[j].compareTo(a_list[LexList.cursor.data]);
                if(comp <= 0){
                    LexList.insertBefore(j);
                    j++;
                    count++;
                    LexList.moveFront();
                    continue;
                }
                else if(comp>0 && LexList.cursor != LexList.back){
                    LexList.moveNext();
                    continue;
                }
                else{
                    LexList.append(j);
                    j++;
                    count++;
                    LexList.moveFront();
                }
            }
        Node printNode = LexList.front;
        for(int i = 0; i < a_list.length; i++){
            out.println(a_list[printNode.data]);
            printNode = printNode.next;
        }
        in.close();
        output.close();
        out.close();
    }
}
