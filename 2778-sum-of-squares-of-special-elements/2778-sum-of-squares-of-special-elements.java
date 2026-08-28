class Solution {
    public int sumOfSquares(int[] nums) {
        List<Integer> l=new ArrayList<>();
        for(int i=0;i<nums.length;i++){
            if(nums.length%(i+1)==0){
                l.add(i);
            }
        }
        int sum=0;
        int[] num=new int[l.size()];
        for(int i=0;i<l.size();i++){
            int index=l.get(i);
             sum=sum+(nums[index]*nums[index]);
        }
        
        return sum;
    }
}