class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int s=1;
        int e=max(piles);
        while(s<e){
            int m=s+(e-s)/2;
            if(search(piles,h,m)){
                e=m;
            }else{
                s=m+1;
            }
        }return s;
    }
    public boolean search(int[] piles,int  h,int k){
        int hour=0;
        //if(k==0){
          //  return false;
        //}
        for(int j:piles){
            hour+=(j+k-1)/k;
        }return hour <=h;
    }
    public int max(int[] piles){
        int max=piles[0];

        for(int i=1;i<piles.length;i++){
            if(piles[i]>max){
               max=piles[i];
            }
        }return max;
    }
}
