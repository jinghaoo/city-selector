<template>
	<div class="vue-city-selector" @mouseout="endChoice" @mouseover="startMouseOver">
		<input 
			v-show="!noInput" 
			type="text" 
			autocomplete="off" 
			disableautocomplete 
			:name="field" 
			:id="field" 
			:value="currCityName" 
			:placeholder="placeholder" 
			@focus="startChoice" 
			@keypress="startChoice" 
			@blur="endChoice" 
			readonly 
			ref="cityParkInput"
		>
		<!--城市选择-->
		<div class="vcp-panel" v-show="cityPanelIsShow">
			<h5>城市选择 <span class="clear-citypanel" @click="clearCityPanel">清空</span></h5>
			<ul class="vcp-tags">
				<li
					:class="{'z-on': item==tagKey}" 
					v-for="(item, index) in tagsArr" 
					:key="index" 
					@click="choiceTag(item)">
					{{ item }}
				</li>
			</ul>
			<div class="vcp-list">
				<div 
					:class="{'z-hot': initial == 'hot'}" 
					v-for="(citys, initial) in cityList" 
					:key="initial" 
					v-show="currTagIncludes(initial)"
				>
					<h6 v-if="initial != 'hot'">{{ initial }}</h6>
					<ul>
						<li v-for="v in citys" @click="choiceCity(v.id)" :title="v.name" :key="v.id">{{ v.name }}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
'use strict';
export default {
    name: 'citySelector',
	props: {
		field: {
			type: String,
			default: ''
		},
		value: {
			default: '',
			twoWay: true
		},
		placeholder: {
			type: String,
			default: ''
		},
		noInput: {
			type: Boolean,
			default: false
		},
		// 城市列表
		cityList: {
			type: Object,
			default: function () {
				return window.CITY_PICKER_LIST || {};
			}
		},
		// 没有热门城市
		noHot: {
			type: Boolean,
			default: false
		}
	},
	data() {
		let tagsArr = ['热门', 'ABCDE', 'FGHJ', 'KLMN', 'PQRST', 'WXYZ'],
			tagKey = '热门',
			tags = {}
		if (this.noHot) {
			tagsArr = ['ABCD', 'EFGH', 'JKL', 'MNPQ', 'RSTW', 'XYZ'];
			tagKey = 'ABCD'
		}
		tagsArr.forEach((item) => {
			if (item === '热门') {
				tags[item] = ['hot']
			} else {
				tags[item] = item.split('')
			}
		});
		return {
			cityPanelIsShow: false,
			isMouseOver: false,
			tagsArr,
			tags,
			tagKey
		}
	},
	computed: {
		// 当前城市名字
		currCityName() {
			let {
				value,
				cityList
			} = this,
			cityName = ''
			Object.keys(cityList).forEach((item) => {
				cityList[item].forEach((item) => {
					if (value === item.id) {
						cityName = item.name
					}
				})
			})
			return cityName
		},
		currTag() {
			let {
				tagKey,
				tags
			} = this
			return tags[tagKey]
		}
	},
	methods: {
        clearCityPanel (){
            this.$emit('input', '')
        },
        // 列表是否属于当前标签
        currTagIncludes (ini) {
            let { currTag } = this
            return currTag.includes(ini)
        },
        // 选择标签
        choiceTag (key) {
            this.tagKey = key
        },
        // 开始城市选择
        startChoice (e) {
            if (e && e.type == 'keypress') {
                e.returnValue = false
            }
            this.cityPanelIsShow = true
        },
        choiceCity (id) {
            this.immEndChoice();
            this.$emit('input', id)
        },
        // 鼠标离开城市选择区域时超过一定时间，关闭城市面板
        endChoice (e) {
            let that = this,
                inputEle = that.$refs.cityParkInput
            if (e.type == 'mouseout') {
                that.isMouseOver = false
            }
            setTimeout(function() {
                if (!that.isMouseOver && inputEle != document.activeElement) {
                    that.cityPanelIsShow = false
                }
            }, 300)
        },
        startMouseOver () {
            this.isMouseOver = true
        },
        // 立即关闭城市面板
        immEndChoice () {
            this.isMouseOver = true
            this.cityPanelIsShow = false
        }
    }
}
</script>

<style scoped lang="stylus">
$defaultColor = #d0000e;
.vue-city-selector {
	position: relative;
	margin: 0;
	padding: 0;
	font: 12px/1.5 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB','\\5b8b\4f53',sans-serif;
	color: #555;

    li {
        list-style-type: none;
    }

	input {
        display: block;
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding-left: 6px;
        outline: none;
        font-size: 14px;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
	}

	.vcp-panel {
        position: absolute;
        z-index: 99999;
        left: 0;
        padding: 12px 10px 0;
        width: 382px;
        border: 1px solid #DDD;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
        overflow: hidden;
        background-color: #FFF;
        animation: vueCitySelector 0.1s ease-out;
        box-sizing: border-box;

        h5 {
            font-size: 12px;
            padding: 0;
            margin: 0;
            margin-bottom: 5px;
            padding-left: 2px;
            color: #aaa;
            line-height: 1.5;
            font-weight: normal;
            position: relative;

            .clear-citypanel {
                position: absolute;
                width: 30px;
                right: 20px;
                top: 0;
                height: 18px;
                line-height: 18px;
                color: $defaultColor;
                cursor: pointer;
            }
        }

        .vcp-tags {
            overflow: hidden;
            margin: 5px 0;
            padding: 0;

            li {
                box-sizing: border-box;
                width: 60px;
                line-height: 20px;
                display: block;
                float: left;
                background-color: #f2f2f3;
                text-align: center;
                border-left: 1px solid #fff;
                cursor: pointer;

                &:first-child {
                    border-left: none;
                }

                &:hover {
                    color: $defaultColor;
                }

                &.z-on {
                    background-color: $defaultColor;
                    color: #fff;
                }
            }
        }

        .vcp-list {
            overflow: hidden;
            border-bottom: 10px solid #fff;

            &> div {
                margin: 1px 0 -1px;
                padding: 5px 0;
                line-height: 24px;
                border-bottom: 1px dashed #eee;
                overflow: hidden;
            }

            h6 {
                float: left;
                font-weight: normal;
                color: $defaultColor;
                font-size: 13px;
                width: 30px;
                margin: 0;
                padding: 0;
                padding-left: 5px;
            }

            ul {
                overflow: hidden;
                padding: 0;
                margin: 0;

                li {
                    float: left;
                    width: 60px;
                    padding-left: 4px;
                    cursor: pointer;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &:hover {
                        background-color: #f2f2f3;
                        color: $defaultColor;
                    }

                    &.z-hot {
                        padding-left: 10px;

                        ul {
                            padding: 0;

                            li {
                                padding-left: 6px;
                            }
                        }
                    }
                }
            }
        }
	}
}

@keyframes vueCitySelector {
	0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
	}

	100% {
        opacity: 1;
        transform: translate(0) scale(1);
	}
}
</style>
