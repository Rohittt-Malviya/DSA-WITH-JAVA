class Solution {
    public List<String> letterCombinations(String digits) {
        return padret("",digits);
    }
    static ArrayList<String> padret(String p, String up){
        if(up.isEmpty()){
            ArrayList<String>list=new ArrayList<>();
            list.add(p);
            return list;
        }
        

        int d=up.charAt(0)-'1';
        ArrayList<String>list=new ArrayList<>();
        if(d==6 ){
            for (int i=(d-1)*3;i<=d*3;i++){
                char ch=(char)('a'+i);
                list.addAll(padret(p+ch,up.substring(1)));
            }
        }
        else if(d==7 ){
            for (int i=((d-1)*3)+1;i<=d*3;i++){
                char ch=(char)('a'+i);
                list.addAll(padret(p+ch,up.substring(1)));
            }
        }else if(d==8 ){
            for (int i=((d-1)*3)+1;i<=(d*3)+1;i++){
                char ch=(char)('a'+i);
                list.addAll(padret(p+ch,up.substring(1)));
            }
        }
        else{
        for (int i=(d-1)*3;i<d*3;i++){
            char ch=(char)('a'+i);
            list.addAll(padret(p+ch,up.substring(1)));
        }
        }
        
        return list;
    }
}