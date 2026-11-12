class Solution {
    public int totalMoney(int n) {
        int count=0;
        int sum=0;
        int m=1;
        for(int i=0;i<n;i++){
            //count++;
            sum=sum+count+m;
            count++;
            if(count==7){
                //int um=m+1;
                count=0;
                m=m+1;
            }
        }return sum;
    }
}