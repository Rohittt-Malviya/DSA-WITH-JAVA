/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode modifiedList(int[] nums, ListNode head) {
        ListNode temp=head;
        Set<Integer> h=new HashSet<>();
        for(int a:nums){
                h.add(a);
        }
        ListNode temp1=new ListNode(-1);
        ListNode t1=temp1;
        while(temp!=null){
            if(!h.contains(temp.val)){
                
            
                t1.next=temp;
                t1=t1.next;
               
                
            }
            temp=temp.next;
        } t1.next=null;
        return temp1.next;
    }
    // public boolean issafe(int val,int[] nums){
    //     for(int i=0;i<nums.length;i++){
    //         if(nums[i]==val){
    //             return true;
    //         }
    //     }return false;

    // }
}