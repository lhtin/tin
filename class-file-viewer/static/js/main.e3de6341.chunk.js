(this["webpackJsonpclass-file-parser-ts"]=this["webpackJsonpclass-file-parser-ts"]||[]).push([[0],{18:function(e,a,t){},19:function(e,a,t){},20:function(e,a,t){},23:function(e,a,t){"use strict";t.r(a);var n,s=t(3),r=t(12),c=t.n(r),i=(t(18),t(19),t(20),t(13)),d=t(5),o=t(6),l=t.n(o),u=t(11),m=t(2),h={ACC_PUBLIC:{value:1,name:"public",desc:"Declared public; may be accessed from outside its package."},ACC_PRIVATE:{value:2,name:"private",desc:"Marked private in source."},ACC_PROTECTED:{value:4,name:"protected",desc:"Marked protected in source."},ACC_STATIC:{value:8,name:"static",desc:"Marked or implicitly static in source."},ACC_FINAL:{value:16,name:"final",desc:"Declared final; no subclasses allowed."},ACC_SUPER:{value:32,name:"",desc:"Treat superclass methods specially when invoked by the invokespecial instruction."},ACC_INTERFACE:{value:512,name:"interface",desc:"Is an interface, not a class."},ACC_ABSTRACT:{value:1024,name:"abstract",desc:"Declared abstract; must not be instantiated."},ACC_SYNTHETIC:{value:4096,name:"synthetic",desc:"Declared synthetic; not present in the source code."},ACC_ANNOTATION:{value:8192,name:"annotation",desc:"Declared as an annotation type."},ACC_ENUM:{value:16384,name:"enum",desc:"Declared as an enum type."},ACC_MODULE:{value:32768,name:"module",desc:"Is a module, not a class or interface."}},f={ACC_PUBLIC:{value:1,name:"public",desc:"Declared public; may be accessed from outside its package."},ACC_PRIVATE:{value:2,name:"private",desc:"Declared protected; may be accessed within subclasses."},ACC_PROTECTED:{value:4,name:"protected",desc:"Declared private; accessible only within the defining class and other classes belonging to the same nest (\xa75.4.4)."},ACC_STATIC:{value:8,name:"static",desc:"Declared static."},ACC_FINAL:{value:16,name:"final",desc:"Declared final; never directly assigned to after object construction (JLS \xa717.5)."},ACC_VOLATILE:{value:64,name:"volatile",desc:"Declared volatile; cannot be cached."},ACC_TRANSIENT:{value:128,name:"transient",desc:"Declared transient; not written or read by a persistent object manager."},ACC_SYNTHETIC:{value:4096,name:"synthetic",desc:"Declared synthetic; not present in the source code."},ACC_ENUM:{value:16384,name:"enum",desc:"Declared as an element of an enum."}},p={ACC_PUBLIC:{value:1,name:"public",desc:"Declared public; may be accessed from outside its package."},ACC_PRIVATE:{value:2,name:"private",desc:"Declared protected; may be accessed within subclasses."},ACC_PROTECTED:{value:4,name:"protected",desc:"Declared private; accessible only within the defining class and other classes belonging to the same nest (\xa75.4.4)."},ACC_STATIC:{value:8,name:"static",desc:"Declared static."},ACC_FINAL:{value:16,name:"final",desc:"Declared final; must not be overridden (\xa75.4.5)."},ACC_SYNCHRONIZED:{value:32,name:"synchronized",desc:"Declared synchronized; invocation is wrapped by a monitor use."},ACC_BRIDGE:{value:64,name:"bridge",desc:"A bridge method, generated by the compiler."},ACC_VARARGS:{value:128,name:"varargs",desc:"Declared with variable number of arguments."},ACC_NATIVE:{value:256,name:"native",desc:"Declared native; implemented in a language other than the Java programming language."},ACC_ABSTRACT:{value:1024,name:"abstract",desc:"Declared abstract; no implementation is provided."},ACC_STRICT:{value:2048,name:"strictfp",desc:"Declared strictfp; floating-point mode is FP- strict."},ACC_SYNTHETIC:{value:4096,name:"synthetic",desc:"Declared synthetic; not present in the source code."}},b=1,j=3,v=4,_=5,x=6,O=7,g=8,y=9,C=10,k=11,N=12,A=15,T=16,w=17,I=18,S=19,U=20,F=(n={},Object(m.a)(n,b,{name:"CONSTANT_Utf8"}),Object(m.a)(n,j,{name:"CONSTANT_Integer"}),Object(m.a)(n,v,{name:"CONSTANT_Float"}),Object(m.a)(n,_,{name:"CONSTANT_Long"}),Object(m.a)(n,x,{name:"CONSTANT_Double"}),Object(m.a)(n,O,{name:"CONSTANT_Class"}),Object(m.a)(n,g,{name:"CONSTANT_String"}),Object(m.a)(n,y,{name:"CONSTANT_Fieldref"}),Object(m.a)(n,C,{name:"CONSTANT_Methodref"}),Object(m.a)(n,k,{name:"CONSTANT_InterfaceMethodref"}),Object(m.a)(n,N,{name:"CONSTANT_NameAndType"}),Object(m.a)(n,A,{name:"CONSTANT_MethodHandle"}),Object(m.a)(n,T,{name:"CONSTANT_MethodType"}),Object(m.a)(n,w,{name:"CONSTANT_Dynamic"}),Object(m.a)(n,I,{name:"CONSTANT_InvokeDynamic"}),Object(m.a)(n,S,{name:"CONSTANT_Module"}),Object(m.a)(n,U,{name:"CONSTANT_Package"}),n),D={1:{name:"REF_getField",desc:"getfield C.f:T"},2:{name:"REF_getStatic",desc:"getstatic C.f:T"},3:{name:"REF_putField",desc:"putfield C.f:T"},4:{name:"REF_putStatic",desc:"putstatic C.f:T"},5:{name:"REF_invokeVirtual",desc:"invokevirtual C.m:(A*)T"},6:{name:"REF_invokeStatic",desc:"invokestatic C.m:(A*)T"},7:{name:"REF_invokeSpecial",desc:"invokespecial C.m:(A*)T"},8:{name:"REF_newInvokeSpecial",desc:"new C; dup; invokespecial C.<init>:(A*)V"},9:{name:"REF_invokeInterface",desc:"invokeinterface C.m:(A*)T"}},E=t(1),L="u1",R="u2",M="u4",B="s1",P="s2",V="s4",H="constant_index1",J="constant_index2",Y="local_index1",q="local_index2",G="branch_offset2",z="branch_offset4",K={0:{name:"nop"},1:{name:"aconst_null"},2:{name:"iconst_m1"},3:{name:"iconst_0"},4:{name:"iconst_1"},5:{name:"iconst_2"},6:{name:"iconst_3"},7:{name:"iconst_4"},8:{name:"iconst_5"},9:{name:"lconst_0"},10:{name:"lconst_1"},11:{name:"fconst_0"},12:{name:"fconst_1"},13:{name:"fconst_2"},14:{name:"dconst_0"},15:{name:"dconst_1"},16:{name:"bipush",operands:[B]},17:{name:"sipush",operands:[R]},18:{name:"ldc",operands:[H]},19:{name:"ldc_w",operands:[J]},20:{name:"ldc2_w",operands:[J]}},W={21:{name:"iload",operands:[Y]},22:{name:"lload",operands:[Y]},23:{name:"fload",operands:[Y]},24:{name:"dload",operands:[Y]},25:{name:"aload",operands:[Y]},26:{name:"iload_0"},27:{name:"iload_1"},28:{name:"iload_2"},29:{name:"iload_3"},30:{name:"lload_0"},31:{name:"lload_1"},32:{name:"lload_2"},33:{name:"lload_3"},34:{name:"fload_0"},35:{name:"fload_1"},36:{name:"fload_2"},37:{name:"fload_3"},38:{name:"dload_0"},39:{name:"dload_1"},40:{name:"dload_2"},41:{name:"dload_3"},42:{name:"aload_0"},43:{name:"aload_1"},44:{name:"aload_2"},45:{name:"aload_3"},46:{name:"iaload"},47:{name:"laload"},48:{name:"faload"},49:{name:"daload"},50:{name:"aaload"},51:{name:"baload"},52:{name:"caload"},53:{name:"saload"}},Z={54:{name:"istore",operands:[Y]},55:{name:"lstore",operands:[Y]},56:{name:"fstore",operands:[Y]},57:{name:"dstore",operands:[Y]},58:{name:"astore",operands:[Y]},59:{name:"istore_0"},60:{name:"istore_1"},61:{name:"istore_2"},62:{name:"istore_3"},63:{name:"lstore_0"},64:{name:"lstore_1"},65:{name:"lstore_2"},66:{name:"lstore_3"},67:{name:"fstore_0"},68:{name:"fstore_1"},69:{name:"fstore_2"},70:{name:"fstore_3"},71:{name:"dstore_0"},72:{name:"dstore_1"},73:{name:"dstore_2"},74:{name:"dstore_3"},75:{name:"astore_0"},76:{name:"astore_1"},77:{name:"astore_2"},78:{name:"astore_3"},79:{name:"iastore"},80:{name:"lastore"},81:{name:"fastore"},82:{name:"dastore"},83:{name:"aastore"},84:{name:"bastore"},85:{name:"castore"},86:{name:"sastore"}},$={96:{name:"iadd"},97:{name:"ladd"},98:{name:"fadd"},99:{name:"dadd"},100:{name:"isub"},101:{name:"lsub"},102:{name:"fsub"},103:{name:"dsub"},104:{name:"imul"},105:{name:"lmul"},106:{name:"fmul"},107:{name:"dmul"},108:{name:"idiv"},109:{name:"ldiv"},110:{name:"fdiv"},111:{name:"ddiv"},112:{name:"irem"},113:{name:"lrem"},114:{name:"frem"},115:{name:"drem"},116:{name:"ineg"},117:{name:"lneg"},118:{name:"fneg"},119:{name:"dneg"},120:{name:"ishl"},121:{name:"lshl"},122:{name:"ishr"},123:{name:"lshr"},124:{name:"iushr"},125:{name:"lushr"},126:{name:"iand"},127:{name:"land"},128:{name:"ior"},129:{name:"lor"},130:{name:"ixor"},131:{name:"lxor"},132:{name:"iinc",operands:[L,B]}},Q={148:{name:"lcmp"},149:{name:"fcmpl"},150:{name:"fcmpg"},151:{name:"dcmpl"},152:{name:"dcmpg"},153:{name:"ifeq",operands:[G]},154:{name:"ifne",operands:[G]},155:{name:"iflt",operands:[G]},156:{name:"ifge",operands:[G]},157:{name:"ifgt",operands:[G]},158:{name:"ifle",operands:[G]},159:{name:"if_icmpeq",operands:[G]},160:{name:"if_icmpne",operands:[G]},161:{name:"if_icmplt",operands:[G]},162:{name:"if_icmpge",operands:[G]},163:{name:"if_icmpgt",operands:[G]},164:{name:"if_icmple",operands:[G]},165:{name:"if_acmpeq",operands:[G]},166:{name:"if_acmpne",operands:[G]}},X={167:{name:"goto",operands:[G]},168:{name:"jsr",operands:[G]},169:{name:"ret",operands:[Y]},170:{name:"tableswitch",padding:4,operands:[V,V,V,V]},171:{name:"lookupswitch",padding:4,operands:[V,V,V,V]},172:{name:"ireturn"},173:{name:"lreturn"},174:{name:"freturn"},175:{name:"dreturn"},176:{name:"areturn"},177:{name:"return"}},ee={178:{name:"getstatic",operands:[J]},179:{name:"putstatic",operands:[J]},180:{name:"getfield",operands:[J]},181:{name:"putfield",operands:[J]},182:{name:"invokevirtual",operands:[J]},183:{name:"invokespecial",operands:[J]},184:{name:"invokestatic",operands:[J]},185:{name:"invokeinterface",operands:[J,R]},186:{name:"invokedynamic",operands:[J,R]},187:{name:"new",operands:[J]},188:{name:"newarray",operands:[L]},189:{name:"anewarray",operands:[J]},190:{name:"arraylength"},191:{name:"athrow"},192:{name:"checkcast",operands:[J]},193:{name:"instanceof",operands:[J]},194:{name:"monitorenter"},195:{name:"monitorexit"}},ae={196:{name:"wide",operands:[L,q]||!1},197:{name:"multianewarray",operands:[J,L]},198:{name:"ifnull",operands:[G]},199:{name:"ifnonnull",operands:[G]},200:{name:"goto_w",operands:[z]},201:{name:"jsr_w",operands:[z]}},te=Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)({},K),W),Z),{87:{name:"pop"},88:{name:"pop2"},89:{name:"dup"},90:{name:"dup_x1"},91:{name:"dup_x2"},92:{name:"dup2"},93:{name:"dup2_x1"},94:{name:"dup2_x2"},95:{name:"swap"}}),$),{133:{name:"i2l"},134:{name:"i2f"},135:{name:"i2d"},136:{name:"l2i"},137:{name:"l2f"},138:{name:"l2d"},139:{name:"f2i"},140:{name:"f2l"},141:{name:"f2d"},142:{name:"d2i"},143:{name:"d2l"},144:{name:"d2f"},145:{name:"i2b"},146:{name:"i2c"},147:{name:"i2s"}}),Q),X),ee),ae),{202:{name:"breakpoint"},254:{name:"impdep1"},255:{name:"impdep2"}}),ne=t(0),se=null,re=function(e){var a,t=e.target.dataset.id;se&&(se.style.backgroundColor="transparent"),(se=document.getElementById(t)).style.backgroundColor="yellow",null===(a=se)||void 0===a||a.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"})},ce=function(e){var a=e.info,t=e.showDesc,n=e.desc;return Object(ne.jsxs)("div",{className:"constant-anchor",children:[Object(ne.jsxs)("div",{onClick:re,className:"anchor",title:a.name,"data-id":"constant_pool_index_".concat(a.value),children:["#",a.value]}),t?Object(ne.jsxs)(ne.Fragment,{children:["\xa0",Object(ne.jsx)(me,{desc:n||a.name||""})]}):null]})},ie=function(e){var a=e.offset;return Object(ne.jsx)("div",{children:Object(ne.jsxs)("div",{className:"constant-anchor anchor",onClick:re,"data-id":"offset-".concat(a),children:["@",a]})})},de=function(e){var a=e.index;return Object(ne.jsx)("div",{children:Object(ne.jsxs)("div",{className:"constant-anchor anchor",onClick:re,"data-id":"bootstrap-method-".concat(a),children:["&",a]})})},oe=function(e){var a=e.index;return Object(ne.jsxs)("div",{className:"constant-index",children:["#",a]})},le=function(e){var a=e.infoList,t=e.children;return Object(ne.jsxs)("div",{className:"constant-value-list",children:[t,Object(ne.jsx)("div",{className:"constant-anchor-list",children:a.map((function(e,a){return Object(ne.jsx)(ce,{info:e},a)}))})]})},ue=function(e){var a=e.tag;return Object(ne.jsx)("div",{className:"constant-tag",children:a.name})},me=function(e){var a=e.desc;return Object(ne.jsxs)("div",{className:"constant-desc",children:["// ",a]})},he=function(e){var a=e.value;return Object(ne.jsx)("div",{className:"constant-value",children:a})},fe=function(e){var a=e.index,t=e.children;return Object(ne.jsx)("div",{className:"constant-item flex-row",id:"constant_pool_index_"+a,children:t})},pe=function(e){var a=e.item,t=e.index;switch(t+=1,a.tag.value){case O:case S:case U:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.name_index]}),Object(ne.jsx)(me,{desc:a.name})]});case y:case C:case k:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.class_index,a.name_and_type_index]}),Object(ne.jsx)(me,{desc:a.name})]});case N:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.name_index,a.descriptor_index]}),Object(ne.jsx)(me,{desc:a.name})]});case g:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.string_index]}),Object(ne.jsx)(me,{desc:a.string_index.name})]});case A:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.reference_index],children:Object(ne.jsxs)("div",{children:[a.reference_kind.value,"\xa0"]})}),Object(ne.jsx)(me,{desc:a.reference_kind.name+" "+a.reference_index.name})]});case T:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.descriptor_index]}),Object(ne.jsx)(me,{desc:a.descriptor_index.name})]});case w:case I:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(le,{infoList:[a.name_and_type_index],children:Object(ne.jsx)(de,{index:a.bootstrap_method_attr_index.value})}),Object(ne.jsx)(me,{desc:a.name})]});case b:case j:case _:case v:case x:return Object(ne.jsxs)(fe,{index:t,children:[Object(ne.jsx)(oe,{index:t}),Object(ne.jsx)(ue,{tag:a.tag}),Object(ne.jsx)(he,{value:a.bytes.name||a.bytes.value})]});default:throw new Error("unknown constant tag")}},be=function(e){var a=e.item;return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsxs)("div",{children:[a.name,";"]}),a.attributes_count.value>0?Object(ne.jsx)(ye,{attributes:a.attributes}):null]})},je=function(e){var a=e.list;return Object(ne.jsx)("ul",{className:"fields-and-methods",children:a.map((function(e,a){return Object(ne.jsx)("li",{className:"field-and-method",children:Object(ne.jsx)(be,{item:e})},a)}))})},ve=function(e){var a=e.tag,t=e.value;return Object(ne.jsxs)("div",{className:"switch",children:[Object(ne.jsxs)("div",{className:"switch-tag",children:[a,":"]}),Object(ne.jsx)("div",{children:Object(ne.jsx)(ie,{offset:t})})]})},_e=function(e){var a=e.inst,t=a[0],n=a[1],s=a[2],r=a[3];return Object(ne.jsxs)("div",{className:"bytecode-tableswitch",children:[Object(ne.jsxs)("div",{className:"opcode-name",children:["".concat(t.name," { ")," ",Object(ne.jsxs)("span",{className:"gray",children:["// ",s.value," - ",r.value]})]}),Object(ne.jsxs)("ul",{children:[a.slice(4).map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(ve,{tag:s.value+a,value:e.value})},a)})),Object(ne.jsx)("li",{children:Object(ne.jsx)(ve,{tag:"default",value:n.value})})]}),Object(ne.jsx)("div",{children:"}"})]})},xe=function(e){for(var a=e.inst,t=a[0],n=a[1],s=a[2],r=[],c=1;c<=s.value;c+=1){var i=a[c+2];r.push(Object(ne.jsx)("li",{children:Object(ne.jsx)(ve,{tag:i[0].value,value:i[1].value})},c))}return Object(ne.jsxs)("div",{className:"bytecode-lockupswitch",children:[Object(ne.jsxs)("div",{className:"opcode-name",children:["".concat(t.name," { ")," ",Object(ne.jsxs)("span",{className:"gray",children:["// ",s.value]})]}),Object(ne.jsxs)("ul",{children:[r,Object(ne.jsx)("li",{children:Object(ne.jsx)(ve,{tag:"default",value:n.value})})]}),Object(ne.jsx)("div",{children:"}"})]})},Oe=function(e){var a=e.inst,t=e.baseOffset,n=a[0],r=n.offset-t;return Object(ne.jsxs)("div",{className:"bytecode",id:"offset-"+r,children:[Object(ne.jsx)("div",{className:"bytecode-offset",children:r}),"tableswitch"===n.name?Object(ne.jsx)(_e,{inst:a}):"lookupswitch"===n.name?Object(ne.jsx)(xe,{inst:a}):Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsx)("div",{className:"opcode-name",children:n.name}),a.slice(1).map((function(e,a){switch(e.type){case H:case J:return Object(ne.jsxs)(s.Fragment,{children:[Object(ne.jsx)(ce,{info:e}),Object(ne.jsx)(me,{desc:e.name})]},a);case Y:case q:return Object(ne.jsxs)("span",{className:"local-index",children:["$",e.value]},a);case G:case z:return Object(ne.jsx)(ie,{offset:e.value},a);default:return Object(ne.jsx)("div",{className:"operand-value",children:e.value},a)}}))]})]})},ge=function(e){var a=e.item;switch(a.attribute_name_index.name){case"Code":var t=a.code_length.offset+a.code_length.bytes;return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsxs)("div",{children:[a.attribute_name_index.name,":"]}),Object(ne.jsxs)("ul",{className:"attribute-code",children:[Object(ne.jsxs)("li",{children:["max_stack=",a.max_stack.value,", locals=",a.max_locals.value]}),a.code.map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(Oe,{inst:e,baseOffset:t})},a)}))]})]});case"ConstantValue":return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsx)("div",{children:a.attribute_name_index.name}),Object(ne.jsx)("div",{children:a.constantvalue_index.name})]});case"SourceFile":return Object(ne.jsxs)("div",{children:[a.attribute_name_index.name,": ",a.sourcefile_index.name]});case"InnerClasses":return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsxs)("div",{children:[a.attribute_name_index.name,"(",a.number_of_classes.value,")"]}),Object(ne.jsx)("ul",{children:a.classes.map((function(e,a){return Object(ne.jsxs)("li",{className:"flex-row",children:[Object(ne.jsxs)("div",{children:["(0x",e.inner_class_access_flags.value.toString(16),") ",e.inner_class_access_flags.name,"\xa0"]}),Object(ne.jsx)(ce,{info:e.inner_name_index}),"=\xa0",Object(ne.jsx)(ce,{info:e.inner_class_info_index})," of\xa0",Object(ne.jsx)(ce,{info:e.outer_class_info_index}),Object(ne.jsx)(me,{desc:"".concat(e.inner_name_index.name," = class ").concat(e.inner_class_info_index.name," of class ").concat(e.outer_class_info_index.name)})]},a)}))})]});case"BootstrapMethods":return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsxs)("div",{children:[a.attribute_name_index.name,"(",a.num_bootstrap_methods.value,")"]}),Object(ne.jsx)("ul",{children:a.bootstrap_methods.map((function(e,a){return Object(ne.jsxs)("li",{id:"bootstrap-method-".concat(a),children:[Object(ne.jsxs)("div",{className:"flex-row",children:[Object(ne.jsxs)("div",{children:[a,":\xa0"]}),Object(ne.jsx)(ce,{info:e.bootstrap_method_ref,showDesc:!0})]}),Object(ne.jsxs)("ul",{children:["Method arguments:",e.bootstrap_arguments.map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(ce,{info:e,showDesc:!0})},a)}))]})]},a)}))})]});default:return null}},ye=function(e){var a=e.attributes;return Object(ne.jsx)("ul",{className:"attributes",children:a.map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(ge,{item:e})},a)}))})},Ce=function(e){var a=e.children,t=Object(s.useState)(!0),n=Object(d.a)(t,2),r=n[0];n[1];return Object(ne.jsx)(ne.Fragment,{children:r?a:null})},ke=function(e){var a=e.data;return Object(ne.jsxs)("div",{className:"class-file-box",children:[Object(ne.jsxs)("div",{children:["version: ",a.version.major.value,".",a.version.minor.value]}),Object(ne.jsxs)("div",{children:["access_flags: (0x",a.access_flags.value.toString(16),") ",a.access_flags.name]}),Object(ne.jsxs)("div",{className:"flex-row",children:["this_class:\xa0",Object(ne.jsx)(ce,{info:a.this_class,showDesc:!0})]}),a.super_class.value>0?Object(ne.jsxs)("div",{className:"flex-row",children:["super_class:\xa0",Object(ne.jsx)(ce,{info:a.super_class,showDesc:!0})]}):null,Object(ne.jsxs)("div",{children:[Object(ne.jsxs)("div",{className:"strong",children:["interfaces(",a.interfaces_count.value,"):"]}),Object(ne.jsx)("ul",{children:a.interfaces.map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(ce,{info:e,showDesc:!0})},a)}))})]}),Object(ne.jsxs)("div",{children:[Object(ne.jsxs)("div",{className:"strong",children:["fields(",a.fields_count.value,"):"]}),Object(ne.jsx)(je,{list:a.fields})]}),Object(ne.jsxs)("div",{children:[Object(ne.jsxs)("div",{className:"strong",children:["methods(",a.methods_count.value,"):"]}),Object(ne.jsx)(je,{list:a.methods})]}),Object(ne.jsxs)("div",{children:[Object(ne.jsxs)("div",{className:"strong",children:["constant_pool(",a.constant_pool_count.value-1,"):"]}),Object(ne.jsx)("ul",{className:"constant-pool diver",children:a.constant_pool.filter((function(e){return e})).map((function(e,a){return Object(ne.jsx)("li",{children:Object(ne.jsx)(pe,{item:e,index:a})},a)}))})]}),Object(ne.jsxs)("div",{children:[Object(ne.jsxs)("div",{className:"strong",children:["attributes(",a.attributes_count.value,"):"]}),Object(ne.jsx)(Ce,{children:Object(ne.jsx)(ye,{attributes:a.attributes})})]})]})},Ne=t(8),Ae=t(9),Te=function(){function e(a){Object(Ne.a)(this,e),this.u=void 0,this.offset=void 0,this.maxOffset=void 0,this.u=a,this.offset=0,this.maxOffset=a.length-1}return Object(Ae.a)(e,[{key:"readUtf8",value:function(e){for(var a=this.offset,t="",n=0;n<e;n+=1){var s=this.u1(),r=void 0;if(s>=224)r=((15&s)<<12)+((63&this.u1())<<6)+(63&this.u1());else if(s>=192){r=((31&s)<<6)+(63&this.u1())}else r=s>=1&&s<=127?s:0;t+=String.fromCodePoint(r)}return{offset:a,bytes:e,value:0,name:t}}},{key:"align",value:function(e,a){var t=e%a;if(t>0)for(var n=t+1;n<=a;n+=1)this.readU1()}},{key:"getOffset",value:function(){return this.offset}},{key:"u1",value:function(){var e=this.u[this.offset];return this.offset+=1,this.checkOffset(),e}},{key:"readU1",value:function(){return{offset:this.offset,bytes:1,value:this.readU(1)}}},{key:"readU2",value:function(){return{offset:this.offset,bytes:2,value:this.readU(2)}}},{key:"readU4",value:function(){return{offset:this.offset,bytes:4,value:this.readU(4)}}},{key:"readU8",value:function(){return{offset:this.offset,bytes:8,value:this.readU(8)}}},{key:"readS1",value:function(){return{offset:this.offset,bytes:1,value:Int8Array.of(this.readU(1))[0]}}},{key:"readS2",value:function(){return{offset:this.offset,bytes:2,value:Int16Array.of(this.readU(2))[0]}}},{key:"readS4",value:function(){return{offset:this.offset,bytes:4,value:Int32Array.of(this.readU(4))[0]}}},{key:"eat",value:function(e){this.offset+=e,this.checkOffset()}},{key:"u1ToHex",value:function(e){return e.toString(16).padStart(2,"0").toUpperCase()}},{key:"checkOffset",value:function(){if(this.offset>this.maxOffset+1)throw new Error("Uint8 EOF")}},{key:"readU",value:function(e){for(var a=0,t=0;t<e;t+=1)a=(a<<8*t)+this.u1();return a}}]),e}(),we=function(){function e(a){Object(Ne.a)(this,e),this.reader=void 0,this.constant_pool=void 0,this.reader=new Te(a)}return Object(Ae.a)(e,[{key:"getData",value:function(){return this.parse()}},{key:"getAccessFlagsDesc",value:function(e,a){return Object.values(a).filter((function(a){return(a.value&e)>0&&a.name})).map((function(e){return e.name})).join(" ")}},{key:"parseClassType",value:function(e){return e.replace(/\//g,".")}},{key:"parseFieldType",value:function(e,a){var t={B:"byte",C:"char",D:"double",F:"float",I:"int",J:"long",Z:"boolean",V:"void"}[e[a]];if(t)return{nextAt:a+1,type:t};if("L"===e[a]){a+=1;for(var n="";";"!==e[a];)n+=e[a],a+=1;return{nextAt:a+1,type:this.parseClassType(n)}}if("["===e[a]){var s=this.parseFieldType(e,a+1);return{nextAt:s.nextAt,type:s.type+"[]"}}throw new Error("unknown field type: "+e)}},{key:"parseDescriptor",value:function(e,a){var t=0;if("("===e[t]){t+=1;for(var n="";")"!==e[t];){var s=this.parseFieldType(e,t),r=s.nextAt;n&&(n+=", "),n+=s.type,t=r}t+=1;var c=this.parseFieldType(e,t).type;return"".concat(c," ").concat(a,"(").concat(n,")")}var i=this.parseFieldType(e,t).type;return"".concat(i," ").concat(a)}},{key:"getName",value:function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if(!this.constant_pool)return"pending";var t=this.constant_pool[e];if(!t)throw new Error("constant_pool_index "+e);switch(t.tag.value){case O:return this.parseClassType(this.getName(t.name_index.value));case S:case U:return this.getName(t.name_index.value);case y:return this.getName(t.name_and_type_index.value,this.getName(t.class_index.value));case C:case k:return this.getName(t.name_and_type_index.value,this.getName(t.class_index.value));case N:a&&(a+=".");var n="".concat(a).concat(this.getName(t.name_index.value)),s=this.getName(t.descriptor_index.value);return this.parseDescriptor(s,n);case g:return this.getName(t.string_index.value);case j:case v:case _:case x:return t.bytes.value;case b:return t.bytes.name;case A:return t.reference_kind.name+" "+this.getName(t.reference_index.value);case T:return this.parseDescriptor(this.getName(t.descriptor_index.value),"");case w:case I:return"bootstrap_".concat(t.bootstrap_method_attr_index.value,": ").concat(this.getName(t.name_and_type_index.value));default:return"unknown tag"}}},{key:"parseBranchOffset2",value:function(e){var a=this.reader.readS2();return a.value+=e,a}},{key:"parseBranchOffset4",value:function(e){var a=this.reader.readS4();return a.value+=e,a}},{key:"parseOperand",value:function(e,a){var t;switch(e){case L:t=this.reader.readU1();break;case R:t=this.reader.readU2();break;case M:t=this.reader.readU4();break;case B:t=this.reader.readS1();break;case P:t=this.reader.readS2();break;case V:t=this.reader.readS4();break;case H:t=this.parseIndex1();break;case J:t=this.parseIndex2();break;case Y:t=this.parseLocal1();break;case q:t=this.parseLocal2();break;case G:t=this.parseBranchOffset2(a);break;case z:t=this.parseBranchOffset4(a);break;default:throw new Error("unknown operand type: "+e)}return t.type=e,t}},{key:"parseMagic",value:function(){return{offset:this.reader.getOffset(),bytes:4,value:"0x"+this.reader.u1ToHex(this.reader.u1())+this.reader.u1ToHex(this.reader.u1())+this.reader.u1ToHex(this.reader.u1())+this.reader.u1ToHex(this.reader.u1())}}},{key:"parseVersion",value:function(){return{minor:this.reader.readU2(),major:this.reader.readU2()}}},{key:"parseCount",value:function(){return this.reader.readU2()}},{key:"parseTag",value:function(){var e=this.reader.readU1();return e.name=F[e.value].name,e}},{key:"parseInteger",value:function(){return this.reader.readU4()}},{key:"parseLong",value:function(){return this.reader.readU8()}},{key:"parseFloat",value:function(){return this.reader.readU4()}},{key:"parseDouble",value:function(){return this.reader.readU8()}},{key:"parseReferenceKind",value:function(){var e=this.reader.readU1();return e.name=D[e.value].name,e}},{key:"parseConstantPool",value:function(){for(var e=this.reader.readU2(),a=[null],t=1;t<e.value;t+=1){var n={tag:this.parseTag()};switch(n.tag.value){case O:case S:case U:n.name_index=this.parseIndex2();break;case y:case C:case k:n.class_index=this.parseClass(),n.name_and_type_index=this.parseIndex2();break;case N:n.name_index=this.parseIndex2(),n.descriptor_index=this.parseIndex2();break;case g:n.string_index=this.parseIndex2();break;case A:n.reference_kind=this.parseReferenceKind(),n.reference_index=this.parseIndex2();break;case T:n.descriptor_index=this.parseIndex2();break;case w:case I:n.bootstrap_method_attr_index=this.reader.readU2(),n.name_and_type_index=this.parseIndex2();break;case b:n.length=this.parseCount(),n.bytes=this.reader.readUtf8(n.length.value);break;case j:n.bytes=this.parseInteger();break;case _:n.bytes=this.parseLong();break;case v:n.bytes=this.parseFloat();break;case x:n.bytes=this.parseDouble();break;default:throw new Error("unknown constant tag")}a.push(n)}return{constant_pool_count:e,constant_pool:a}}},{key:"resolveConstantIndex",value:function(){for(var e=this,a=function(a){var t=e.constant_pool[a];t.name=e.getName(a);["name_index","class_index","name_and_type_index","descriptor_index","string_index","reference_index"].forEach((function(a){t[a]&&(t[a].name=e.getName(t[a].value))}))},t=1;t<this.constant_pool.length;t+=1)a(t)}},{key:"parseFlags",value:function(e){var a=this.reader.readU2();return a.name=this.getAccessFlagsDesc(a.value,e).replace(/ACC_/g,"").toLowerCase(),a}},{key:"parseClass",value:function(){var e=this.reader.readU2();return 0===e.value?e.name="":e.name=this.getName(e.value),e}},{key:"parseIndex2",value:function(){var e=this.reader.readU2();return e.name=this.getName(e.value),e}},{key:"parseIndex1",value:function(){var e=this.reader.readU1();return e.name=this.getName(e.value),e}},{key:"parseLocal1",value:function(){var e=this.reader.readU1();return e.name="@"+e.value,e}},{key:"parseLocal2",value:function(){var e=this.reader.readU2();return e.name="@"+e.value,e}},{key:"parseAttribute",value:function(){var e={attribute_name_index:this.parseIndex2(),attribute_length:this.reader.readU4()};switch(e.attribute_name_index.name){case"Code":e=Object(E.a)(Object(E.a)({},e),this.parseCodeAttribute());break;case"BootstrapMethods":e=Object(E.a)(Object(E.a)({},e),this.parseBootstrapMethodsAttribute());break;case"ConstantValue":e=Object(E.a)(Object(E.a)({},e),{},{constantvalue_index:this.parseIndex2()});break;case"SourceFile":e=Object(E.a)(Object(E.a)({},e),{},{sourcefile_index:this.parseIndex2()});break;case"InnerClasses":e=Object(E.a)(Object(E.a)({},e),this.parseInnerClasses());break;default:e.info={offset:this.reader.getOffset(),bytes:null},this.reader.eat(e.attribute_length.value)}return e}},{key:"parseAttributes",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push(this.parseAttribute());return{attributes_count:e,attributes:a}}},{key:"parseFieldOrMethod",value:function(e){var a={access_flags:this.parseFlags(e),name_index:this.parseIndex2(),descriptor_index:this.parseIndex2()},t=this.getName(a.descriptor_index.value);return Object(E.a)(Object(E.a)({name:"".concat(a.access_flags.name," ").concat(this.parseDescriptor(t,this.getName(a.name_index.value)))},a),this.parseAttributes())}},{key:"parseFields",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push(this.parseFieldOrMethod(f));return{fields_count:e,fields:a}}},{key:"parseMethods",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push(this.parseFieldOrMethod(p));return{methods_count:e,methods:a}}},{key:"parseInterfaces",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push(this.parseClass());return{interfaces_count:e,interfaces:a}}},{key:"parseOpcode",value:function(){var e=this.reader.readU1(),a=te[e.value];if(!a)throw new Error("unknown opcode "+e.value);return e.name=a.name,{opcode:e,operands:a.operands}}},{key:"parseInstruction",value:function(e){var a=this.parseOpcode(),t=a.opcode,n=a.operands,s=t.offset-e,r=[t];if("wide"===t.name){var c=this.parseOpcode().opcode;r.push(c),r.push(this.reader.readU2()),"iinc"===c.name&&r.push(this.reader.readU2())}else if("tableswitch"===t.name){this.reader.align(s+1,4);var i=this.reader.readS4();i.value+=s,r.push(i);var d=this.reader.readS4(),o=this.reader.readS4();r.push(d),r.push(o);for(var l=d.value;l<=o.value;l+=1){var u=this.reader.readS4();u.value+=s,r.push(u)}}else if("lookupswitch"===t.name){this.reader.align(s+1,4);var m=this.reader.readS4();m.value+=s,r.push(m);var h=this.reader.readS4();r.push(h);for(var f=0;f<h.value;f+=1){var p=this.reader.readS4(),b=this.reader.readS4();b.value+=s,r.push([p,b])}}else if("invokedynamic"===t.name||"invokeinterface"===t.name)r.push(this.parseOperand(n[0],s)),this.parseOperand(n[1],s);else if(n)for(var j=0;j<n.length;j+=1)r.push(this.parseOperand(n[j],s));return r}},{key:"parseCode",value:function(){for(var e=this.reader.readU4(),a=this.reader.getOffset(),t=a+e.value,n=[];this.reader.getOffset()<t;)n.push(this.parseInstruction(a));return{code_length:e,code:n}}},{key:"parseExceptionTable",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push({start_pc:this.reader.readU2(),end_pc:this.reader.readU2(),handler_pc:this.reader.readU2(),catch_type:this.parseClass()});return{exception_table_length:e,exception_table:a}}},{key:"parseCodeAttribute",value:function(){return Object(E.a)(Object(E.a)(Object(E.a)({max_stack:this.reader.readU2(),max_locals:this.reader.readU2()},this.parseCode()),this.parseExceptionTable()),this.parseAttributes())}},{key:"parseBootstrapMethodsAttribute",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1){for(var n=this.parseIndex2(),s=this.reader.readU2(),r=[],c=0;c<s.value;c+=1)r.push(this.parseIndex2());a.push({bootstrap_method_ref:n,num_bootstrap_arguments:s,bootstrap_arguments:r})}return{num_bootstrap_methods:e,bootstrap_methods:a}}},{key:"parseInnerClasses",value:function(){for(var e=this.reader.readU2(),a=[],t=0;t<e.value;t+=1)a.push({inner_class_info_index:this.parseClass(),outer_class_info_index:this.parseClass(),inner_name_index:this.parseIndex2(),inner_class_access_flags:this.parseFlags(h)});return{number_of_classes:e,classes:a}}},{key:"parse",value:function(){var e=this.parseMagic(),a=this.parseVersion(),t=this.parseConstantPool();this.constant_pool=t.constant_pool,this.resolveConstantIndex();var n=Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)(Object(E.a)({magic:e,version:a},t),{},{access_flags:this.parseFlags(h),this_class:this.parseClass(),super_class:this.parseClass()},this.parseInterfaces()),this.parseFields()),this.parseMethods()),this.parseAttributes());return console.log("parse data",n),n}}]),e}(),Ie={filename:"HelloWorld.class",data:Uint8Array.of(202,254,186,190,0,0,0,59,0,29,10,0,2,0,3,7,0,4,12,0,5,0,6,1,0,16,106,97,118,97,47,108,97,110,103,47,79,98,106,101,99,116,1,0,6,60,105,110,105,116,62,1,0,3,40,41,86,9,0,8,0,9,7,0,10,12,0,11,0,12,1,0,16,106,97,118,97,47,108,97,110,103,47,83,121,115,116,101,109,1,0,3,111,117,116,1,0,21,76,106,97,118,97,47,105,111,47,80,114,105,110,116,83,116,114,101,97,109,59,8,0,14,1,0,12,72,101,108,108,111,32,87,111,114,108,100,33,10,0,16,0,17,7,0,18,12,0,19,0,20,1,0,19,106,97,118,97,47,105,111,47,80,114,105,110,116,83,116,114,101,97,109,1,0,7,112,114,105,110,116,108,110,1,0,21,40,76,106,97,118,97,47,108,97,110,103,47,83,116,114,105,110,103,59,41,86,7,0,22,1,0,10,72,101,108,108,111,87,111,114,108,100,1,0,4,67,111,100,101,1,0,15,76,105,110,101,78,117,109,98,101,114,84,97,98,108,101,1,0,4,109,97,105,110,1,0,22,40,91,76,106,97,118,97,47,108,97,110,103,47,83,116,114,105,110,103,59,41,86,1,0,10,83,111,117,114,99,101,70,105,108,101,1,0,15,72,101,108,108,111,87,111,114,108,100,46,106,97,118,97,0,33,0,21,0,2,0,0,0,0,0,2,0,1,0,5,0,6,0,1,0,23,0,0,0,29,0,1,0,1,0,0,0,5,42,183,0,1,177,0,0,0,1,0,24,0,0,0,6,0,1,0,0,0,1,0,137,0,25,0,26,0,1,0,23,0,0,0,37,0,2,0,1,0,0,0,9,178,0,7,18,13,182,0,15,177,0,0,0,1,0,24,0,0,0,10,0,2,0,0,0,3,0,8,0,4,0,1,0,27,0,0,0,2,0,28)},Se=function(){var e=Object(u.a)(l.a.mark((function e(a){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.arrayBuffer();case 2:return t=e.sent,e.abrupt("return",new Uint8Array(t));case 4:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),Ue=function(e){var a=e.onParse,t=Object(s.useState)(localStorage.getItem("class-file-name")||""),n=Object(d.a)(t,2),r=n[0],c=n[1],i=Object(s.useRef)(null),o=Object(s.useCallback)((function(e){var t,n,s=null===i||void 0===i||null===(t=i.current)||void 0===t||null===(n=t.files)||void 0===n?void 0:n[0];s&&(c(s.name),localStorage.setItem("class-file-name",s.name),a(s))}),[i,a]);return Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsxs)("div",{className:"panel flex-row flex-align-center",children:[Object(ne.jsx)("label",{htmlFor:"file-select",className:"button",children:"select a class file to view"}),Object(ne.jsx)("input",{id:"file-select",ref:i,type:"file",accept:".class",onChange:o})]}),r?Object(ne.jsx)("div",{children:r}):null]})},Fe=function(){var e=Object(s.useState)(function(){var e=localStorage.getItem("class-file-data");try{var a;return e?(console.log("use cached class file data(".concat(localStorage.getItem("class-file-name"),").")),a=Uint8Array.of.apply(Uint8Array,Object(i.a)(e.split(",").map((function(e){return Number(e)}))))):(console.log("use default class file(HelloWorld.class)."),a=Ie.data,localStorage.setItem("class-file-name",Ie.filename)),new we(a).getData()}catch(t){return null}}()),a=Object(d.a)(e,2),t=a[0],n=a[1],r=Object(s.useCallback)(function(){var e=Object(u.a)(l.a.mark((function e(a){var t,s;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Se(a);case 2:t=e.sent,localStorage.setItem("class-file-data",t.toString()),s=new we(t).getData(),n(s);case 6:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),[n]);return Object(ne.jsxs)("div",{className:"flex-column flex-align-center app",children:[Object(ne.jsx)(Ue,{onParse:r}),t?Object(ne.jsxs)(ne.Fragment,{children:[Object(ne.jsx)(ke,{data:t}),Object(ne.jsx)("a",{className:"link",href:"https://github.com/lhtin/class-file-viewer",children:"GitHub"})]}):null]})},De=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,24)).then((function(a){var t=a.getCLS,n=a.getFID,s=a.getFCP,r=a.getLCP,c=a.getTTFB;t(e),n(e),s(e),r(e),c(e)}))};c.a.render(Object(ne.jsx)(s.StrictMode,{children:Object(ne.jsx)(Fe,{})}),document.getElementById("root")),De()}},[[23,1,2]]]);
//# sourceMappingURL=main.e3de6341.chunk.js.map