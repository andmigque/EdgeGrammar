---
name: codex-curriculus
description: "Use this skill anytime you are asked to work on a resume"
---
 
# __Codex Curriculus__ 📜
 
> A rules engine for creating professionally resonant resumes
 
---
 
## Rules
 
### __1. Actions Speak Loudest as Verbs__ ⚡
 
_Use verb-first, action-oriented language to begin each line._
 
##### 1.1 Do This
Led cross-functional team of 12 to deliver product 3 weeks ahead of schedule.
 
##### 1.2 Don't Do This
Think outside the box. Team player. Detail-oriented.
 
---
 
### __2. Make Bullet Points Multitask__ ⚙️
 
_A list item is strongest when technical execution, business acumen, and leadership form the armored vest._
 
---
 
### __3. Metrics Matter__ ⚓️📊
 
_Numbers are the five senses of the corporate world. Allude to them, then state them, plainly._
 
##### 3.1 Do This
Standardized AWS architecture across 3 product teams. Reduced system downtime by 22%. Cut monthly spend by $8k.
 
##### 3.2 Don't Do This
Created processes to baseline system architectures.
 
---
 
### __4. Tasks are Best when Achieved__ 🎹💔
 
_Tasks are tension; results are the resolution. Make the horse drink after you lead it to the water._
 
##### 4.1 Do This
Led quarterly business reviews for 40 enterprise accounts. Implemented automated health scoring. Surfaced churn risk 60 days early. Retained 98% of top-tier clients over 3 years.
 
##### 4.2 Don't Do This
Responsible for overseeing the daily management of client accounts.
 
---
 
### __5. Tailor Later__ 🎯
 
_Create lines that precisely reflect the work you performed. Next, create alternate versions that are tailored to the work you are applying to._
 
---
 
### __6. Don't Be a Jar-Jar-Jargon Binks__ 👻
 
_Jargon must serve impact. Don't use so many buzzwords that you hide your actual achievements._
 
##### 6.1 Do This
Unified two competing sales teams under a shared CRM pipeline, eliminating duplicate outreach and increasing Q3 revenue by $1.2M.
 
##### 6.2 Don't Do This
Leveraged synergies to optimize bandwidth.
 
 
---
 
### __7. One Victory Per Sentence__ 🏆
 
_Run on sentences make you sound less intelligent._
 
##### 7.1 Do This
Led 40 enterprise accounts. Implemented automated health scoring. Surfaced churn risk 60 days early. Retained 98% of top-tier clients over 3 years.
 
##### 7.2 Don't Do This
Led quarterly business reviews for 40 enterprise accounts, implementing automated health scoring that surfaced churn risk 60 days early and retained 98% of top-tier clients over 3 years.
 
---
 
## Refactors
 
Turning a resume into a good resume using the rules of the curriculus is not magic, it is sequential.
 
Use the following Powershell as your bullet point refactoring algorithm:
 
```powershell
$rules | ForEach-Object { 
    $description = $_.Description
    # Internalize the rules description. Try to understand it's intent
 
    $doThis = $_.DoThis
    $dontDoThis = $_.DontDoThis
 
    # Internalize the do this and don't do this for each rule
 
    # Internally, in your thoughts, attempt to create a second example of this rules doThis and dontDoThis
 
    $_.Refactor($resumeBulletPoint)
 
}
```