class Solution {
    public int[] getSneakyNumbers(int[] nums) {
       Set<Integer> s=new HashSet<>();
       int[] ans=new int[2];
       int idx=0;
       int count=0;
       for(int a=0;a<nums.length;a++){
        if(s.contains(nums[a])){
           // count++;
            
                ans[idx]=nums[a];
                idx++;
                //count=0;
            
        }
        
        s.add(nums[a]);
       } return ans;
       //for(int a:s.size())
    }
}