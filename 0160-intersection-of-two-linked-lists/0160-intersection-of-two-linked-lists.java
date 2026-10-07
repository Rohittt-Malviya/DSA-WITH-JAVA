/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode temp=headA;
        ListNode tempB=headB;
        int lengthA=0;
        int lengthB=0;
        while(temp!=null){
            temp=temp.next;
            lengthA++;
        }
        while(tempB!=null){
            lengthB++;
            tempB=tempB.next;
        }
        temp=headA;
        tempB=headB;
        int a=Math.abs(lengthA-lengthB);
        if(lengthA>lengthB){
            for(int i=1;i<=a;i++){
                temp=temp.next;
            }
        }
        else{
             for(int i=1;i<=a;i++){
                tempB=tempB.next;
            }
        }
        while(temp!=tempB){
               temp=temp.next;
               tempB=tempB.next;
        }
        return temp;
        
    }
}