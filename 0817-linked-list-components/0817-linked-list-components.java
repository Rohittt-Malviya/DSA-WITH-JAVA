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
    public int numComponents(ListNode head, int[] nums) {
        Set<Integer> h=new HashSet<>();
        for(int a:nums){
            h.add(a);
        }
        int count=0;
        ListNode temp=head;
        while(temp!=null){
            if(h.contains(temp.val)){
               count++;
               while(temp!=null && h.contains(temp.val)){
                temp=temp.next;
               }
            }
            if(temp!=null){
                temp=temp.next;
            }
        }return count;
    }
}