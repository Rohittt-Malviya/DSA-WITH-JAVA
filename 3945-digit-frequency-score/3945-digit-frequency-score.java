class Solution {
    public int digitFrequencyScore(int n) {
        int s=0;
        while(n!=0){
            int t=n%10;
            s+=t;
            n/=10;
        }
        return s;
    }
    
}