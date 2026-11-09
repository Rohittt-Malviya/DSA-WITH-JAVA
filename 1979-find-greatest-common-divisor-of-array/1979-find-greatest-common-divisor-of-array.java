class Solution {
    public int findGCD(int[] nums) {
        int min=Integer.MAX_VALUE;
        int max=Integer.MIN_VALUE;
        Arrays.sort(nums);
        min=nums[0];
        max=nums[nums.length-1];
        return gcd(min,max);

    }
    public int gcd(int a,int b){
        if(a==0){
            return b;
        }return gcd(b%a,a);
    }
}