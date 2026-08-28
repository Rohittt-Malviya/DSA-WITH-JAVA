class Solution {
    public boolean isPerfectSquare(int num) {
        int s=1;

        int e=num;
       
        while(s<=e){
            int m=s+(e-s)/2;

            if((long)m*m==num){
                return true;
            } else if((long) m*m<num){
                s=m+1;
            }else{
                e=m-1;
            }
        }return false;
    }
}