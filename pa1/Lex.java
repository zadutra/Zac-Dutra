import java.util.*;
import java.io.*;

class Lex{
    public static void main(String[]args)throws IOException{
        PrintWriter out;
        Scanner in;
        String line;
        String[] token;
        int i, n, lineNumber = 0;
        if(args.length < 2){
            System.err.println("Usage: FileIO infile outfile");
            System.exit(1);
        }
        in = new Scanner(new File(args[0]));
        FileWriter output = new FileWriter(new File(args[1]));
        out = new PrintWriter(output);
        while(in.hasNextLine()){
            lineNumber++;
            line = in.nextLine() + " ";
            token = line.split("\\s+");
            n = token.length;
            for(i = 0; i < n; i++){
                out.println(token[i]);
            }
            out.println();
        }
        
        in.close();
        output.close();
        out.close();
    }
}
