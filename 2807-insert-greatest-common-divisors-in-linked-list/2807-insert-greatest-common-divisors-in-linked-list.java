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
    public ListNode insertGreatestCommonDivisors(ListNode head) {
        ListNode temp=head;
        ListNode temp1=new ListNode(-1);
        ListNode t1=temp1;
        while(temp!=null && temp.next!=null){
        int d=gcd(temp.val,temp.next.val);
        ListNode re=new ListNode(d);
        ListNode u=temp.next;
        temp.next=re;
        temp=temp.next;
        temp.next=u;
        temp=temp.next;
        }//t1.next=temp;
        return head;
    }
    public int gcd(int a,int b){
        if(a==0){
            return b;
        }
        return gcd(b%a,a);
    }
}