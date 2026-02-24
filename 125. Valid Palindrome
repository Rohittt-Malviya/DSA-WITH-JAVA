class Solution {
    public boolean isPalindrome(String s) {
        String u=s.replaceAll("[^a-zA-Z0-9]", "");
        String n=u.strip();
        String m=n.toLowerCase();
        int i=0;
        int e=m.length()-1;
        while(i<e){
            if(m.charAt(i)==m.charAt(e)){
                i++;
                e--;
            }else {
                return false;
            }
        }return true;
    }
}
