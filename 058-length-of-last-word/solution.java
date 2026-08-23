class Solution {
    public int lengthOfLastWord(String s) {
        String[] p =s.trim().split("\\s+");
        if(s.length()==0){
            return 0;
        }
        return p[p.length -1].length();
    }
}
