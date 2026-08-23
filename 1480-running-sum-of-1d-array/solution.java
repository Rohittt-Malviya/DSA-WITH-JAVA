class Solution {
    public int[] runningSum(int[] nums) {
        int[] a=new int[nums.length];
        int res=0;
        int index=0;
        for(int i=0;i<=nums.length-1;i++){
            res=res+nums[i];
            a[index]=res;
            index++;

        }
        return a;
        
    }
}
