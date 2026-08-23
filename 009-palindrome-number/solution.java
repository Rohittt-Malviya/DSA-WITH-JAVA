class Solution {
    public boolean isPalindrome(int x) {
        int a=x;
        int res=0;
        while(x>0){
            res=res*10+x%10;
            x/=10;
            
        }if(res==a){
            return true;
        }return false;
        
    }
}
