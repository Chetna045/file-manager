#!/usr/bin/env node
//input for help
let inputArr=process.argv.slice(2);
let fs=require('fs');
const { lstat } = require('fs/promises');
let path =require('path');
let types ={
    audio :['aif','cda','mid','midi','mp3','mpa','ogg','wav','wma','wpl'],
    compressed:['7z','arj','deb','pkg','rar','rmp','tar.gz','z','zip'],
    document:['txt','rtf','wpd','pdf','md','doc','docx','docm','odt','ppt','pptx','html','htm','odp'],
   databses:['csv','dat','db','dbf','log','mdb','sav','sql','tar','xml','xlsx','xls','ods','xlsm'],
    image:['png','jpg','jpeg','ai','bmp','gif','ps','psd','svg','tif','tiff'],
    Application:['exe','apk','bat','bin','cgi','pl','com','gadget','jar','msi','wsf'],
    programming:['c','cpp','class','cs','h','java','php','py','sh','swift','vb'],
    System:['bak','cab','cfg','cpl','cur','dll','dmp','drv','icns','ico','ini','lnk','msi','sys','tmp'],
    video:['3g2','3gp','avi','flv','h264','m4v','mkv','mov','mp4','mpg','mpeg','rm','swf','vob','wmv']
};
//console.log(inputArr);
//organize have path too
//node main.js organize "pathdir"
//node main.js tree "pathdir"
//node main.js help
let command =inputArr[0];

switch(command)
{
    case "help":
        helpfn();
        break;
    case "tree":
    treefn(inputArr[1]);
        break;
    case "organize":
    organizefn(inputArr[1]);
        break;
    default:
        console.log("please provide a command");
        break;

}
function helpfn(){
    console.log(
        `
    node main.js organize "pathdir"
    node main.js tree "pathdir"
    node main.js help
        
        `
    );}
    function organizefn (dirpath)
    {
        // 1. input from user of the path
        let destpath ;
       if(dirpath == undefined)
        {//console.log("please provide the path to organize!!!");
         destpath=process.cwd();
            return;

        }
        else{
           if( fs.existsSync(dirpath)==true)
           {
               destpath =path.join(dirpath,"Organized Folder");
           //create dir
           if(fs.existsSync(destpath)==false)
              fs.mkdirSync(destpath);
            }
           else{
               console.log("please provide correct path")
                 return;
            }
            organizehelper(dirpath,destpath);

        }};
      function  organizehelper(src,dest)
        {
            let childnames=fs.readdirSync(src);
          //  console.log(childnames);
          for(let i=0;i<childnames.length;i++)
          {
              let childaddress=path.join(src,childnames[i]);
              //console.log(childaddress);
              //if path is file then we will work if folder then we wont't work
              let isFile=fs.lstatSync(childaddress).isFile();
              if(isFile)
              {
                 // console.log(childnames[i]);
                  //3. identify category
                   //2. create the dir or folder named as organise_folder
        //3. categorize them
                  let category=getcategory(childnames[i]);
                 //console.log(childnames[i] +"belongs to " +category);
                 //4. make dir of respective dir and cut /copy from dirpath to category folder
                 sendfiles(childaddress,dest,category);

              }
          }

        };
        function getcategory(name)
        {
            let ext=path.extname(name);
            ext=ext.slice(1);
           // console.log(ext);
           //compare it with the keys in objects
           for(let keys in types)
           {
               let ctypearr=types[keys];
               for(let i=0;i<ctypearr.length;i++)
               {
                   if(ext==ctypearr[i])
                   {
                       return keys;
                   }
                  
               }
              
           }
           return "others";

        }
        function sendfiles(srcfilepath,dest,category)
        {
            let categorypath= path.join(dest,category);
            if(fs.existsSync(categorypath)==false)
            {fs.mkdirSync(categorypath);}

            let filename=path.basename(srcfilepath);
            let destpathfile=path.join(categorypath,filename);
            fs.copyFileSync(srcfilepath,destpathfile);
            console.log(filename,"copying to this",category);
            if(category=="System");
            else
             fs.unlinkSync(srcfilepath);
        }
function treefn(dirpath)
{
    let destpath ;
    if(dirpath == undefined)
     {//console.log("Please provide the path too!!!");
      // process.cwd;
       treehelper(process.cwd(),"");
        return;

     }
     else{
        if( fs.existsSync(dirpath)==true)
        { let indentation="";
            treehelper(dirpath,indentation);
         }
        else{
            console.log("please provide correct path")
              return;
         }

}

}

function treehelper(dirpath,indentation)
{
    //if path has a file or folder
   let isFile= fs.lstatSync(dirpath).isFile();
   if(isFile)
   { let filename =path.basename(dirpath);
       console.log(indentation+"├───"+filename);
   }
   else
   {
       let dirname= path.basename(dirpath);
       console.log(indentation+"└───"+dirname);
       let childrens = fs.readdirSync(dirpath);
       for(let i=0;i<childrens.length;i++)
       {
           let childpath=path.join(dirpath,childrens[i]);
           treehelper(childpath,indentation+"\t");
       }

   }
}
