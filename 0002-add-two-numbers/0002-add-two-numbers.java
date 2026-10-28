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
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
     
        int carry=0;
        ListNode t1=l1;
        ListNode t2=l2;
        ListNode answ=new ListNode(-1);
        ListNode ans=answ;
        while(t1!=null || t2!=null || carry!=0){
            int sum=carry;
            if(t1!=null){
                sum=sum+t1.val;
            }
            if(t2!=null){
                sum=sum+t2.val;
            }
             if(sum>9){
                int rem=sum%10;
                carry=sum/10;
               ans.next=new ListNode(rem);

               
               ans=ans.next;
             }else{
                ans.next=new ListNode(sum);
                ans=ans.next;
                carry=0;
             }
             if(t1!=null)t1=t1.next;
             
            if(t2!=null) t2=t2.next;
        }
        
        return (answ.next);
    }
    public ListNode reverse(ListNode head){
        ListNode prev=null;
        ListNode curr=head;
        ListNode fwd=null;
        while(curr!=null){
            fwd=curr.next;
            curr.next=prev;
            prev=curr;
            curr=fwd;
        }return prev;
    }
}