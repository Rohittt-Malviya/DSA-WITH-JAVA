class Solution {
    public int numberOfSteps(int num) {
        int steps=0;
        return count (num,steps);
    }
    static int count(int num,int steps){
        if(num==0){
            return steps;
        }
        else if(num%2==0){
            return count (num/2 , steps +1);
        }return count(num-1 , steps +1);
    }
}
