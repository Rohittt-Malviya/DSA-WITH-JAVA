class Solution {
    public String truncateSentence(String s, int k) {
        StringBuilder sb=new StringBuilder();
        String[] word=s.split(" ");
        for(int i=0;i<k;i++){
            //char ch=word.charAt(i);
            sb.append(word[i]);
            if(i<k-1){
            sb.append(" ");
            }
        }
        //
        return sb.toString();
    }
}