class MyLinkedList {
    class Node{
        int val;
        Node next;
        Node(int val){
            this.val=val;
            this.next=null;
        }
    }
    Node head;
     Node tail;
     int size=0;


    public MyLinkedList() {
       this.head=null;
       this.tail=null;
       this.size=0;
    }
    
    public int get(int index) {
        Node temp=head;
        if(index>=size || index<0){
            return -1;
        }
        for(int i=0;i<index;i++){
            temp=temp.next;
        }//temp=temp.next;
        return temp.val;
    }
    
    public void addAtHead(int val) {
        Node n=new Node(val);
        if(head==null)head=tail=n;
        else{
            n.next=head;
            head=n;
        }size++;
    }
    
    public void addAtTail(int val) {
        Node n=new Node(val); 
        if(tail==null)head=tail=n;
        else{
            tail.next=n;
            tail=n;
        }size++;
    }
    
    public void addAtIndex(int index, int val) {
        Node n=new Node(val);
        Node temp=head;
        if(index<0||index>size)return;
        
        if(index==0){addAtHead(val);return;}
        if(index==size)
        {addAtTail(val);return;}
        for(int i=0;i<index-1;i++){
         temp=temp.next;
        }
        Node h=temp.next;
        temp.next=n;
        n.next=h;
        size++;
    }
    
    public void deleteAtIndex(int idx) {
        Node temp=head;
     if (idx<0||idx>=size)return;
     if(idx==0){
        head=head.next;
        size--;
        if(size==0){
            tail=null;
        }return;
     }
     for (int i=0;i<idx-1;i++){
         temp=temp.next;
     }
     if (idx==size-1) {

        tail=temp;
        temp.next=null;
        size--;
     return;}
     
     
     temp.next=temp.next.next;
     size--;
    }
    
}

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * MyLinkedList obj = new MyLinkedList();
 * int param_1 = obj.get(index);
 * obj.addAtHead(val);
 * obj.addAtTail(val);
 * obj.addAtIndex(index,val);
 * obj.deleteAtIndex(index);
 */