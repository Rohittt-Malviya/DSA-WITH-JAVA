class Solution {
    public int digitFrequencyScore(int n) {
        Map<Integer,Integer> map=new HashMap<>();
        String s=Integer.toString(n);
        int[] nums=new int[s.length()];
        for(int i=0;i<s.length();i++){
            char ch=s.charAt(i);
            int di=ch-'0';
           // nums[i]=di;
            
                map.put(di,map.getOrDefault(di,0)+1);
            
            

        }
        
        int result=0;
        for(int d:map.keySet()){
           int value=map.get(d);
           result=result+(d*value);
        }return result;


    }
    
}