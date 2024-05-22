# Copy and Paste into PlantUML server: https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000 or insert into draw.io: https://app.diagrams.net/

## Class Diagram

@startuml
Left to Right Direction

class UserAccount {
+email: Email
+username: Char
+is_active: BooleanF
+is_staff: BooleanF
+is_superuser: Boolean
+objects: UserAccountManager
+get_full_name()
+get_short_name()
}

class Attachment {
+id: UUID
+name: Char
+url: Char
+courseId: ForeignKey
+createdAt: DateTime
+updatedAt: DateTime
}

class BankAccount {
+id: AutoField
+card_number: Char
+card_holder: Char
+expire_year: Integer
+expire_month: Integer
+cvv: Char
+balance: Decimal
}

class Category {
+id: UUID
+name: Char
}

class Chapter {
+id: UUID
+title: Char
+description: Text
+videoUrl: Char
+position: Integer
+isPublished: Boolean
+isFree: Boolean
+courseId: ForeignKey
+createdAt: DateTime
+updatedAt: DateTime
}

class Course {
+id: UUID
+userId: Char
+title: Char
+description: Text
+imageUrl: Char
+price: Float
+isPublished: Boolean
+categoryId: ForeignKey
+createdAt: DateTime
+updatedAt: DateTime
}

class MuxData {
+id: UUID
+assetId: Char
+playbackId: Char
+chapterId: OneToOne
}

class Purchase {
+id: UUID
+userId: Char
+courseId: ForeignKey
+createdAt: DateTime
+updatedAt: DateTime
}

class UserProgress {
+id: UUID
+userId: Char
+chapterId: ForeignKey
+isCompleted: Boolean
+createdAt: DateTime
+updatedAt: DateTime
}

UserAccount "1" -- "n" BankAccount
UserAccount "1" -- "n" Purchase
UserAccount "1" -- "n" UserProgress
Course "1" -- "n" Attachment
Course "1" -- "n" Chapter
Course "1" -- "n" Purchase
Course "1" -- "n" UserProgress
Category "1" -- "n" Course
Chapter "1" -- "1" MuxData
Chapter "1" -- "n" UserProgress

@enduml

## Authentication Use Case Diagram

Left to Right Direction
skinparam packageStyle rectangle

actor User as User
actor Auth_System as AS

rectangle "Authentication" {
usecase "Sign Up" as UC1
usecase "Fill Form" as UC9
usecase "Save Information" as UC2
usecase "Send Activation Email" as UC3
usecase "Login" as UC4
usecase "Provide Credentials" as UC10
usecase "Authenticate" as UC5
usecase "Logout" as UC7
usecase "Redirect" as UC8
}

User --> UC1
UC1 --> UC9
UC9 --> UC2
AS --> UC2
UC2 --> UC3
AS --> UC3
User --> UC4
UC4 --> UC10
UC10 --> UC5
AS --> UC5
User --> UC7
UC7 --> UC8
AS --> UC8

@enduml

## Authentication Sequence Diagram

@startuml

== Authentication System ==

actor "User" as S
participant "Frontend" as FS
participant "AuthServer" as AS

S -> FS : Login
S -> FS : Provide Credentials
FS -> AS : Send Credentials

alt Credentials valid
activate AS
AS -> AS: Verify Account

    AS -> FS: Confirm Login

deactivate AS
FS -> S: Give Access
else Credentials invalid
activate AS
AS -> AS: Verify Account
AS -> FS: Refuse Login
deactivate AS
FS -> S: Alert Error
end

FS -> S : Redirect

@enduml

## Course CRUD Use case

@startuml
left to right direction

actor Teacher as User
actor Content_Server as CS

rectangle "Course CRUD" {
usecase "Login" as UC1
usecase "Create Course" as UC2
usecase "Fill Form" as UC3
usecase "Save Information" as UC5
usecase "Retrieve Courses" as UC4
usecase "Update Course" as UC6
usecase "Update Form" as UC7
usecase "Save Update Information" as UC9
usecase "Delete Course" as UC10
}

User --> UC1
UC1 --> UC2
UC2 --> UC3
CS --> UC3
UC3 --> UC5
CS --> UC5
UC1 --> UC4
CS --> UC4
UC1 --> UC6
UC6 --> UC7
CS --> UC7
UC7 --> UC9
CS --> UC9
UC1 --> UC10
CS --> UC10

@enduml

## Course CRUD Sequence

@startuml
actor Teacher as User
participant FrontendServer as FS
participant ContentServer as BS

== Course Management Module ==

User -> FS: Create Course
FS -> User: Provide Creation Form
User -> FS: Input Title
FS -> FS: Validate Course Title
FS -> BS: Send Course Title
BS -> BS: Create New Course
BS -> FS: Return New Course Information
FS -> User: Provide Detail Customize Form
User -> FS: Input/Upload Content Respectively
FS -> BS: Send Course Information
BS -> BS: Save Course Information
User -> FS: Publish Course
FS -> BS: Send Publish Request
BS -> BS: Publish Course
BS -> FS: Return Published Course
FS -> User: Display Published Course

@enduml

## Purchase Use Case

@startuml
Left to Right Direction
skinparam packageStyle rectangle

actor User as User
actor BankServer as BS

rectangle "Purchase Management Module" {
usecase "Explore Courses" as UC1
usecase "Enroll Course" as UC2
usecase "Purchase" as UC7
}

User --> UC1
UC1 --> UC2
UC2 --> UC7 : <<include>>
BS --> UC7

@enduml

## Purchase Sequence

@startuml
actor Customer as User
participant Frontend as FS
participant BankServer as B
participant ContentServer as BS

== Membership Module ==
User -> FS: Enroll Course
FS -> User: Payment Information Form
User -> FS: Input Bank Account
FS -> B: Request Transaction

alt bank account information correct
activate B
B -> B: Verify Account

    B -> FS: Confirm Transaction

deactivate B
FS -> BS: Perform Enroll Operation
else bank account information incorrect
activate B
B -> B: Verify Account
B -> FS: Block Transaction
deactivate B
FS -> User: Alert Error
end

@enduml
