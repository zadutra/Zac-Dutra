(* $Id: interp.ml,v 1.9 2020-01-28 13:33:00-08 - - $ *)

open Absyn

exception Unimplemented of string
let no_expr reason = raise (Unimplemented reason)
let no_stmt reason continuation = raise (Unimplemented reason)

let want_dump = ref false

let helper (memref: Absyn.memref) (expr: Absyn.expr) :float = match memref with 
    | Absyn.Variable ident -> Hashtbl.find Tables.variable_table ident
    | Absyn.Arrayref (ident, expr)-> 
(*
		let arr = Hashtbl.find Tables.array_table ident

	(*	Array.get arr (eval_expr expr) *)
		in Array.get arr (eval_expr expr)
		(*Hashtbl.find Tables.array_table ident *)
*)

let rec eval_expr (expr : Absyn.expr) : float = match expr with
    | Number number -> number
    | Memref memref -> 
        ( match memref with
			| Variable ident-> (helpfun memref expr) 
			| Arrayref (ident,expr) -> Array.get (Hashtbl.find Tables.array_table ident) (int_of_float(eval_expr expr))
		)
    | Unary (oper, expr) -> (Hashtbl.find Tables.unary_fn_table oper) (eval_expr expr)
    | Binary (oper, expr1, expr2) -> (Hashtbl.find Tables.binary_fn_table oper) (eval_expr expr1) (eval_expr expr2)

let interpret_dim ident (expr: Absyn.expr) = 
	Hashtbl.add Tables.array_table ident (Array.make(int_of_float (eval_expr expr)) 0.0)


	(*print_string "in in-dim\n"*)

let rec interpret (program : Absyn.program) = match program with
    | [] -> ()
    | firstline::continuation -> match firstline with
      | _, _, None -> interpret continuation
      | _, _, Some stmt -> (interpret (interp_stmt stmt lines))

      (* | _,_, Some stmt -> ( let next_line = interp_stmt stmt in (match next_line with
					| None -> interpret lines
					| Some line -> interpret line
								))*)

let interpret_label (label: Absyn.label) = (*match label with*)
    Hashtbl.find Tables.label_table label

let interp_let (memref : Absyn.memref) (expr: Absyn.expr) : unit  = match memref with
  | Absyn.Variable ident -> (Hashtbl.add Tables.variable_table ident (eval_expr expr))
  | Absyn.Arrayref (ident,exprr) -> Array.set (Hashtbl.find Tables.array_table ident) (int_of_float(eval_expr exprr)) (eval_expr expr ) 

let interp_stmt (stmt : Absyn.stmt)=
    match stmt with
    | Dim (ident, expr) -> (interpret_dim ident expr; lines)
    | Let (memref, expr) -> (interpret_let memref expr; lines)
    | Goto label -> interpret_label label
    | If (expr, label) -> interpret_if label expr lines
    | Print print_list -> (interp_print print_list; lines)
    | Input memref_list -> (interp_input memref_list; lines)

let interp_print (print_list : Absyn.printable list)=
    let print_item item =
        (print_string " ";
         match item with
         | String string ->
           let regex = Str.regexp "\"\\(.*\\)\""
           in print_string (Str.replace_first regex "\\1" string)
         | Printexpr expr ->
           print_float (eval_expr expr))
    in (List.iter print_item print_list; print_newline ());

let interpret_if (label) (expr : Absyn.expr) (lines) =
	if( (eval_expr expr)=1.0)
	  then interpret_label label 
	  else lines


let interp_input (memref_list : Absyn.memref list) =
    let input_number memref =
        try  let number = Etc.read_number ()
            (* in (print_float number; print_newline ())*)
        in  match memref with
            | Absyn.Variable ident -> ( 
                (Hashtbl.add Tables.variable_table ident number)
            )
            | Absyn.Arrayref (ident,exprr) -> ( 
                Array.set (Hashtbl.find Tables.array_table ident) (int_of_float(eval_expr exprr)) (number);
            )             
        with End_of_file -> 
             (print_string "End_of_file"; print_newline ())
    in List.iter input_number memref_list;

let interpret_program program =
    (Tables.init_label_table program; 
     if !want_dump then Tables.dump_label_table ();
     if !want_dump then Dumper.dump_program program;
     interpret program)
