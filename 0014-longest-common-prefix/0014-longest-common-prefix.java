class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs==null || strs.length==0){
            return "";}
            Arrays.sort(strs);
            String f=strs[0];
            String l=strs[strs.length-1];
            int i=0;
            while(i<f.length() && i<l.length()&& f.charAt(i)==l.charAt(i)){
                i++;
            }
            return f.substring(0,i);
        }
 }
