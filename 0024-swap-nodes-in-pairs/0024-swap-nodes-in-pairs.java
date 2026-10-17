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
    public ListNode swapPairs(ListNode head) {
        ListNode s=new ListNode(-1);
        ListNode f=new ListNode(-1);
        if(head==null || head.next==null)return head;
        ListNode even=s;
        ListNode odd=f;
        int i=1;
        ListNode temp=head;
        while(temp!=null){
            if(i%2==0){
                even.next=temp;
                even=even.next;
            }else{
                odd.next=temp;
                odd=odd.next;
            }temp=temp.next;
            i++;
        }
        even.next=null;
        odd.next=null;
        even=s.next;
        odd=f.next;
        ListNode re=new ListNode(-1);
        ListNode ans=re;
        while(even!=null || odd!=null){
            if(even!=null){
            ans.next=even;
            even=even.next;
            ans=ans.next;}
            if(odd!=null){
            ans.next=odd;
            odd=odd.next;
            ans=ans.next;}
        } //head=ans;
        return re.next;
    }
}